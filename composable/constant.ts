import axios from "axios";
import store from "~/composable/store";

export const registerEnv = async () => {
  const res = await axios.get("/env");
  const env = res.data;
  console.log(env);
  return env;
};

export const getInstanceUrlStorage = () => {
  const instanceUrl =
    store.session.get("instanceURL") || store.cookie.get("instanceURL");
  if (!instanceUrl) {
    throw new Error("Instance URL is not found in storage");
  }
  return instanceUrl;
};

export const getAccessTokenStorage = () => {
  const accessToken =
    store.session.get("accessToken") || store.cookie.get("accessToken");
  if (!accessToken) {
    throw new Error("Access Token not found in storage");
  }
  return accessToken;
};
