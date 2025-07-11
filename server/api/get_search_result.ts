import { createRestAPIClient } from "masto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.url || !body.accessToken) {
    throw new Error("No accessToken provided");
  }
  const client = createRestAPIClient({
    url: body.url,
    accessToken: body.accessToken,
  });
  let limit = 40;
  if (body.type === "statuses") {
    limit = 10;
  }

  const results = await client.v2.search.list({
    q: body.queryText, // 你的搜索关键词
    resolve: true, // 是否解析外部实例用户，推荐设置 true
    limit: limit, // 可选，限制每类返回的条数
    type: body.type, // 可选，"accounts" | "hashtags" | "statuses",
    offset: body.offset,
  });

  let datas;
  if (body.type === "accounts") {
    const accounts = results.accounts;
    datas = accounts.map((result: any) => {
      return {
        id: result.id,
        username: result.username,
        acct: result.acct,
        displayName: result.displayName,
        url: result.url,
        avatar: result.avatar,
        followersCount: result.followersCount,
      };
    });
  } else if (body.type === "hashtags") {
    const hashtags = results.hashtags;
    console.log(hashtags);
    datas = hashtags.map((result: any) => {
      return {
        id: result.id,
        name: result.name,
        url: result.url,
      };
    });
  } else if (body.type === "statuses") {
    const statuses = results.statuses;
    // console.log(statuses);
    datas = statuses;
  }

  return datas;
});
