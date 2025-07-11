import { createRestAPIClient } from "masto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const client = createRestAPIClient({
    url: body.url,
    accessToken: body.accessToken,
  });
  const status = await client.v1.statuses.$select(body.id).fetch();
  // console.log("status", status);
  return status;
});
