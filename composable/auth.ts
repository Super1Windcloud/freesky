import {
  getCredentialApplication,
  storeCredentialApplication,
  hasAccountInInstance,
} from "~/composable/store-utils";
import { generateCodeChallenge, verifier } from "./oauth-pkce";
import { registerEnv } from "./constant";

import store from "~/composable/store";

export async function supportsPKCE(instanceURL: string) {
  if (!instanceURL) return false;
  try {
    const res = await fetch(
      `${instanceURL}/.well-known/oauth-authorization-server`,
    );
    if (!res.ok || res.status !== 200) return false;
    const json = await res.json();
    if (json.code_challenge_methods_supported?.includes("S256")) return true;
    return false;
  } catch (e) {
    return false;
  }
}

export async function registerApplication(instanceURL: string) {
  const { CLIENT_NAME, REDIRECT_URI, SCOPES, WEBSITE } = await registerEnv();

  const registrationParams = new URLSearchParams({
    client_name: CLIENT_NAME,
    redirect_uris: REDIRECT_URI,
    scopes: SCOPES,
    website: WEBSITE,
  });
  console.log("registerApplication", registrationParams);
  const registrationResponse = await fetch(`${instanceURL}/api/v1/apps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: registrationParams.toString(),
  });
  try {
    const registrationJSON = await registrationResponse.json();
    console.log("registrationJSON" + registrationJSON);
    return registrationJSON;
  } catch (e) {
    console.error(e);
  }
}

export const submitInstance = async (instanceURL: string) => {
  if (!instanceURL) return;

  store.local.set("instanceURL", instanceURL);
  try {
    console.log("access url " + instanceURL);
    let credentialApplication = getCredentialApplication(instanceURL);
    console.log("credentialApplication", credentialApplication);
    if (!credentialApplication || credentialApplication.error) {
      console.log("start register application");
      credentialApplication = await registerApplication(instanceURL);
      if (!credentialApplication) {
        return;
      }
      storeCredentialApplication(instanceURL, credentialApplication);
    }

    const { client_id, client_secret } = credentialApplication;

    const authPKCE = await supportsPKCE(instanceURL);
    console.log({ authPKCE });
    const forceLogin = hasAccountInInstance(instanceURL);
    if (authPKCE) {
      console.log("client_id and client_secret", client_id, client_secret);
      if (client_id && client_secret) {
        const [url, verifier] = await getPKCEAuthorizationURL({
          instanceURL,
          client_id,
          forceLogin,
        });
        store.sessionCookie.set("codeVerifier", verifier);
        location.href = url;
      } else {
        alert(`Failed to register application`);
      }
    } else {
      if (client_id && client_secret) {
        location.href = await getAuthorizationURL({
          instanceURL,
          client_id,
          forceLogin,
        });
      } else {
        alert(`Failed to register application`);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export async function getAuthorizationURL({
  instanceURL,
  client_id,
  forceLogin = false,
}) {
  const { CLIENT_NAME, REDIRECT_URI, SCOPES, WEBSITE } = await registerEnv();

  const authorizationParams = new URLSearchParams({
    client_id,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    // redirect_uri: 'urn:ietf:wg:oauth:2.0:oob', // 当前页面显示授权码
    response_type: "code",
  });
  if (forceLogin) authorizationParams.append("force_login", "true");
  const authorizationURL = `${instanceURL}/oauth/authorize?${authorizationParams.toString()}`;
  return authorizationURL;
}

export async function getPKCEAuthorizationURL({
  instanceURL,
  client_id,
  forceLogin = false,
}) {
  const codeVerifier = verifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const { CLIENT_NAME, REDIRECT_URI, SCOPES, WEBSITE } = await registerEnv();

  const params = new URLSearchParams({
    client_id,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES,
  });
  if (forceLogin) params.append("force_login", "true");
  const authorizationURL = `${instanceURL}/oauth/authorize?${params.toString()}`;
  return [authorizationURL, codeVerifier];
}
