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

  const results = await client.v2.search.list({
    q: body.queryText, // 你的搜索关键词
    resolve: true, // 是否解析外部实例用户，推荐设置 true
    limit: 100, // 可选，限制每类返回的条数
    type: body.type, // 可选，"accounts" | "hashtags" | "statuses"
  });

  const accounts = results.accounts;
  // console.dir(accounts);

  const datas = accounts.map((result: any) => {
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

  return datas;
});
