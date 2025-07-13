import { createRestAPIClient  } from "masto";


export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const client = createRestAPIClient({
      url : body.url,
      accessToken : body.accessToken,
  });

  const result =await client.v1.accounts.verifyCredentials();
  // console.log(result);
  return result;

});
