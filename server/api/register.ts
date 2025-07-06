// server/api/register.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, email, password } = body;

  console.log("后端收到注册信息：", { username, email, password });

  return {
    success: true,
    message: "注册成功",
  };
});
