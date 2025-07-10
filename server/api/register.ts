// server/api/register.ts
import { executeRegisterAutomation } from "../../utils/browser";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, email, password, url } = body;

  console.log(body);

  const  registerUrl = url.endsWith('/') ? url+'auth/sign_up' : url + '/auth/sign_up';

  await  executeRegisterAutomation(registerUrl, body );

  return {
    success: true,
    message: "注册成功",
  };
});
