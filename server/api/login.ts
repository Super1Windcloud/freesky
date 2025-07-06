// server/api/register.ts
import axios from "axios";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;

  const body = await readBody(event);
  const { email, password } = body;

  console.log("后端收到登录信息：", { email, password });
  const response = await axios.get(`${baseUrl}/users/me`, {
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(body),
  });

  const data = response.data;
  console.log("后端返回的登录信息：", data);

  return {
    success: true,
    message: "登录成功",
  };
});
