import axios from "axios";

export async function followPerson(
  id: string,
  index: number,
  instanceUrl: string,
  accessToken: string,
  callback: () => void,
) {
  try {
    let res = await axios.post("/api/follow-person", {
      url: instanceUrl,
      accessToken: accessToken,
      id: id,
    });
    const data = res.data;
    if (!data.success) {
      console.error("follow failed", data.message);
      return;
    }
    callback();
  } catch (error) {
    console.log("follow error", error);
  }
}

export async function unFollowPerson(
  id: string,
  index: number,
  instanceUrl: string,
  accessToken: string,
  callback: () => void,
) {
  try {
    let res = await axios.post("/api/unfollow_person", {
      url: instanceUrl,
      accessToken: accessToken,
      id: id,
    });
    const data = res.data;
    if (!data.success) {
      console.error("unfollow failed", data.message);
      return;
    }
    callback();
  } catch (error) {
    console.log("unfollow error", error);
  }
}

import store from "~/composable/store";
import { useInstanceUrlStore, useAccessTokenStore } from "~/store";

const instanceUrl: string | null =
  useInstanceUrlStore().getInstanceUrl || store.session.get("instanceURL");
const accessToken: string | null =
  useAccessTokenStore().getAccessToken || store.session.get("accessToken");

export async function getAccountsData(queryText: string) {
  try {
    const res = await axios.post("/api/get_search_result", {
      url: instanceUrl,
      accessToken: accessToken,
      queryText: queryText,
      type: "accounts",
    });
    const data = res.data;
    console.log("account data", data);
    return data;
  } catch (error) {
    console.error("get accounts data ", error);
  }
}
