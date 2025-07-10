// server/api/register.ts
import axios from "axios";
import { createRestAPIClient  } from "masto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { url } = body;

  console.log("access url " + url);
  const masto = createRestAPIClient({
    url: url,
    accessToken: process.env.ACCESS_TOKEN,
  });



  return {
    success: true,
    message: "登录成功",
  };
});
