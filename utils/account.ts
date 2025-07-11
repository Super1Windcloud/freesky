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

export async function getAccountsData(
  queryText: string,
  currentDataCount: number,
  instanceUrl: string,
  accessToken: string,
) {
  try {
    const res = await axios.post("/api/get_search_result", {
      url: instanceUrl,
      accessToken: accessToken,
      queryText: queryText,
      type: "accounts",
      offset: currentDataCount,
    });
    const data = res.data;
    console.log("account data", data);
    return data;
  } catch (error) {
    console.error("get accounts data ", error);
  }
}

export async function getHashTagsData(
  queryText: string,
  currentDataCount: number,
  instanceUrl: string,
  accessToken: string,
) {
  try {
    const res = await axios.post("/api/get_search_result", {
      url: instanceUrl,
      accessToken: accessToken,
      queryText: queryText,
      type: "hashtags",
      offset: currentDataCount,
    });
    const data = res.data;
    console.log("hashtags data", data);
    return data;
  } catch (error) {
    console.error("get hashtags data ", error);
  }
}

export async function getStatusesData(
  queryText: string,
  currentDataCount: number,
  instanceUrl: string,
  accessToken: string,
) {
  try {
    const res = await axios.post("/api/get_search_result", {
      url: instanceUrl,
      accessToken: accessToken,
      queryText: queryText,
      type: "statuses",
      offset: currentDataCount,
    });
    const data = res.data;
    console.log("statuses data", data);
    return data;
  } catch (error) {
    console.error("get statuses data ", error);
  }
}
