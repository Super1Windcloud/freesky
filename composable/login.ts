import store from "./store";
import { getCredentialApplication } from "~/composable/store-utils";
import { getVapidKey } from "~/composable/store-utils";
import { initClient  , initInstance , initPreferences, initAccount} from "~/composable/api";

export async function getAccessToken({
  instanceURL,
  client_id,
  client_secret,
  code,
  code_verifier,
}) {
  const REDIRECT_URI = `${window.location.origin}`;

  const params = new URLSearchParams({
    client_id,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
    code,
    // scope: SCOPES, // Not needed
    // client_secret,
    // code_verifier,
  });
  if (client_secret) {
    params.append("client_secret", client_secret);
  }
  if (code_verifier) {
    params.append("code_verifier", code_verifier);
  }
  const tokenResponse = await fetch(`${instanceURL}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const tokenJSON = await tokenResponse.json();
  console.log("tokenJson", tokenJSON);
  return tokenJSON;
}

export async function detectedIsLoggedIn(callback: () => void, storeState : (url, token)=>void ) {
  const instanceURL = store.local.get("instanceURL") || "" ;
  const code = decodeURIComponent(
    (window.location.search.match(/code=([^&]+)/) || [, ""])[1],
  );

  if (code) {
    console.log({ code });
    // Clear the code from the URL
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname || "/",
    );

    const { client_id, client_secret, vapid_key } =
      getCredentialApplication(instanceURL) || {};
    const vapidKey = getVapidKey(instanceURL) || vapid_key;
    const verifier = store.sessionCookie.get("codeVerifier");

    const { access_token: accessToken } = await getAccessToken({
      instanceURL,
      client_id,
      client_secret,
      code,
      code_verifier: verifier || undefined,
    });

    if (accessToken) {
      callback();
      storeState(instanceURL, accessToken)
      store.session.set("accessToken", accessToken);
      store.session.set("instanceURL", instanceURL );
      store.cookie.set("accessToken", accessToken);
      store.cookie.set("instanceURL", instanceURL);

      const client =await  initClient( instanceURL , accessToken);
      await Promise.allSettled([
        initPreferences(client),
        initInstance(client, instanceURL),
        initAccount(client, instanceURL, accessToken, vapidKey),
      ]);
    }
  }
}

