import { createRestAPIClient } from "masto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, url } = body;
  console.log(body);

  const client = createRestAPIClient({
    url: url,
    accessToken: process.env.ACCESS_TOKEN,
  });

  try {
    const account = await client.v1.accounts.lookup({
      acct: username, // 不加 @，只填用户名
    });
    console.log("用户存在:", account.url);
    return {
      message: "用户名已存在",
      success: true,
    };
  } catch (err) {
    console.log("用户不存在:", err.response?.status); // 通常是 404
    return {
      message: "用户名可用",
      success: false  ,
    }
  }
});
