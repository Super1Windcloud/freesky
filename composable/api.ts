import { compareVersions, satisfies, validate } from "compare-versions";
import { createRestAPIClient, createStreamingAPIClient } from "masto";

import store from "./store";
import {
  getAccount,
  getAccountByAccessToken,
  getAccountByInstance,
  getCurrentAccount,
  saveAccount,
  setCurrentAccountID,
} from "./store-utils";

const DEFAULT_INSTANCE = "mastodon.social";

const apis = {};

const accountApis = {};

let currentAccountApi: Object;

export async function initClient(
  instance : string = DEFAULT_INSTANCE,
  accessToken?: string,
) {
  if (/^https?:\/\//.test(instance)) {
    instance = instance
      .replace(/^https?:\/\//, "")
      .replace(/\/+$/, "")
      .toLowerCase();
  }
  const url = instance ? `https://${instance}` : `https://${DEFAULT_INSTANCE}`;

  const masto = createRestAPIClient({
    url,
    accessToken, // Can be null
    timeout: 2 * 60_000, // Unfortunatly this is global instead of per-request
  });

  const client = {
    masto,
    instance,
    accessToken,
  };
  apis[instance] = client;
  if (!accountApis[instance]) accountApis[instance] = {};
  if (accessToken) accountApis[instance][accessToken] = client;

  return client;
}

export function hasInstance(instance) {
  const instances = store.local.getJSON("instances") || {};
  return !!instances[instance];
}

// Get the instance information
// The config is needed for composing
export async function initInstance(client, instance) {
  console.log("INIT INSTANCE", client, instance);
  const { masto, accessToken } = client;
  // Request v2, fallback to v1 if fail
  let info;
  try {
    info = await masto.v2.instance.fetch();
  } catch (e) {}
  if (!info) {
    try {
      info = await masto.v1.instance.fetch();
    } catch (e) {}
  }
  if (!info) return;
  console.log(info);
  const {
    // v1
    uri,
    urls: { streamingApi } = {},
    // v2
    domain,
    configuration: { urls: { streaming } = {} } = {},
  } = info;

  const instances = store.local.getJSON("instances") || {};
  if (uri || domain) {
    instances[
      (domain || uri)
        .replace(/^https?:\/\//, "")
        .replace(/\/+$/, "")
        .toLowerCase()
    ] = info;
  }
  if (instance) {
    instances[instance.toLowerCase()] = info;
  }
  store.local.setJSON("instances", instances);

  let nodeInfo;
  // GoToSocial requires we get the NodeInfo to identify server type
  // spec: https://github.com/jhass/nodeinfo
  try {
    if (uri || domain) {
      let urlBase = uri || `https://${domain}`;
      const wellKnown = await (
        await fetch(`${urlBase}/.well-known/nodeinfo`)
      ).json();
      if (Array.isArray(wellKnown?.links)) {
        const schema = "http://nodeinfo.diaspora.software/ns/schema/";
        const nodeInfoUrl = wellKnown.links
          .filter(
            (link) =>
              typeof link.rel === "string" &&
              link.rel.startsWith(schema) &&
              validate(link.rel.slice(schema.length)),
          )
          .map((link) => {
            let version = link.rel.slice(schema.length);
            return {
              version,
              href: link.href,
            };
          })
          .sort((a, b) => -compareVersions(a.version, b.version))
          .find((x) => satisfies(x.version, "<=2"))?.href;
        if (nodeInfoUrl) {
          nodeInfo = await (await fetch(nodeInfoUrl)).json();
        }
      }
    }
  } catch (e) {}
  const nodeInfos = store.local.getJSON("nodeInfos") || {};
  if (nodeInfo) {
    nodeInfos[instance.toLowerCase()] = nodeInfo;
  }
  store.local.setJSON("nodeInfos", nodeInfos);

  // This is a weird place to put this but here's updating the masto instance with the streaming API URL set in the configuration
  // Reason: Streaming WebSocket URL may change, unlike the standard API REST URLs
  const supportsWebSocket = "WebSocket" in window;
  if (supportsWebSocket && (streamingApi || streaming)) {
    console.log("🎏 Streaming API URL:", streaming || streamingApi);
    // masto.config.props.streamingApiUrl = streaming || streamingApi;
    // Legacy masto.ws
    const streamClient = createStreamingAPIClient({
      streamingApiUrl: streaming || streamingApi,
      accessToken,
      implementation: WebSocket,
    });
    client.streaming = streamClient;
    // masto.ws = streamClient;
    console.log("🎏 Streaming API client:", client);
  }
}

// Get the account information and store it
export async function initAccount(client, instance, accessToken, vapidKey) {
  const { masto } = client;
  const mastoAccount = await masto.v1.accounts.verifyCredentials();

  console.log("CURRENTACCOUNT SET", mastoAccount.id);
  setCurrentAccountID(mastoAccount.id);

  saveAccount({
    info: mastoAccount,
    instanceURL: instance.toLowerCase(),
    accessToken,
    vapidKey,
    createdAt: Date.now(),
  });
}

export function setPreferences(preferences) {
  store.account.set("preferences", preferences);
}

// Get preferences
export async function initPreferences(client) {
  try {
    const { masto } = client;
    const preferences = await masto.v1.preferences.fetch();
    setPreferences(preferences);
  } catch (e) {
    // silently fail
    console.error("init preferences failed", e);
  }
}

// Get the masto instance
// If accountID is provided, get the masto instance for that account
export function api({ instance, accessToken, accountID, account } = {}) {
  // Always lowercase and trim the instance
  if (instance) {
    instance = instance.toLowerCase().trim();
  }

  // If instance and accessToken are provided, get the masto instance for that account
  if (instance && accessToken) {
    const client =
      accountApis[instance]?.[accessToken] || initClient(instance, accessToken);
    const { masto, streaming } = client;
    return {
      masto,
      streaming,
      client,
      authenticated: true,
      instance,
    };
  }

  if (accessToken) {
    // If only accessToken is provided, get the masto instance for that accessToken
    console.log("X 1", accountApis);
    for (const instance in accountApis) {
      if (accountApis[instance][accessToken]) {
        console.log("X 2", accountApis, instance, accessToken);
        const client = accountApis[instance][accessToken];
        const { masto, streaming } = client;
        return {
          masto,
          streaming,
          client,
          authenticated: true,
          instance,
        };
      } else {
        console.log("X 3", accountApis, instance, accessToken);
        const account = getAccountByAccessToken(accessToken);
        if (account) {
          const accessToken = account.accessToken;
          const instance = account.instanceURL.toLowerCase().trim();
          const client = initClient(instance, accessToken);
          const { masto, streaming } = client;
          return {
            masto,
            streaming,
            client,
            authenticated: true,
            instance,
          };
        } else {
          throw new Error(`Access token not found`);
        }
      }
    }
  }

  // If account is provided, get the masto instance for that account
  if (account || accountID) {
    account = account || getAccount(accountID);
    if (account) {
      const accessToken = account.accessToken;
      const instance = account.instanceURL.toLowerCase().trim();
      const client =
        accountApis[instance]?.[accessToken] ||
        initClient(instance, accessToken);
      const { masto, streaming } = client;
      return {
        masto,
        streaming,
        client,
        authenticated: true,
        instance,
      };
    } else {
      throw new Error(`Account ${accountID} not found`);
    }
  }

  const currentAccount = getCurrentAccount();

  // If only instance is provided, get the masto instance for that instance
  if (instance) {
    if (currentAccountApi?.instance === instance) {
      return {
        masto: currentAccountApi.masto,
        streaming: currentAccountApi.streaming,
        client: currentAccountApi,
        authenticated: true,
        instance,
      };
    }

    if (currentAccount?.instanceURL === instance) {
      const { accessToken } = currentAccount;
      currentAccountApi =
        accountApis[instance]?.[accessToken] ||
        initClient(instance, accessToken);
      return {
        masto: currentAccountApi.masto,
        streaming: currentAccountApi.streaming,
        client: currentAccountApi,
        authenticated: true,
        instance,
      };
    }

    const instanceAccount = getAccountByInstance(instance);
    if (instanceAccount) {
      const accessToken = instanceAccount.accessToken;
      const client =
        accountApis[instance]?.[accessToken] ||
        initClient(instance, accessToken);
      const { masto, streaming } = client;
      return {
        masto,
        streaming,
        client,
        authenticated: true,
        instance,
      };
    }

    const client = apis[instance] || initClient(instance);
    const { masto, streaming, accessToken } = client;
    return {
      masto,
      streaming,
      client,
      authenticated: !!accessToken,
      instance,
    };
  }

  // If no instance is provided, get the masto instance for the current account
  if (currentAccountApi) {
    return {
      masto: currentAccountApi.masto,
      streaming: currentAccountApi.streaming,
      client: currentAccountApi,
      authenticated: true,
      instance: currentAccountApi.instance,
    };
  }
  if (currentAccount) {
    const { accessToken, instanceURL: instance } = currentAccount;
    currentAccountApi =
      accountApis[instance]?.[accessToken] || initClient(instance, accessToken);
    return {
      masto: currentAccountApi.masto,
      streaming: currentAccountApi.streaming,
      client: currentAccountApi,
      authenticated: true,
      instance,
    };
  }

  // If no instance is provided and no account is logged in, get the masto instance for DEFAULT_INSTANCE
  const client = apis[DEFAULT_INSTANCE] || initClient(DEFAULT_INSTANCE);
  const { masto, streaming } = client;
  return {
    masto,
    streaming,
    client,
    authenticated: false,
    instance: DEFAULT_INSTANCE,
  };
}
