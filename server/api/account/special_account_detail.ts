import { createRestAPIClient } from "masto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const client = createRestAPIClient({
    url: body.url,
    accessToken: body.accessToken,
  });

  const result = await client.v1.accounts.$select(body.id).fetch();

  console.log("user info" , result);
  return result;
});
