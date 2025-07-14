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

  const result = await client.v1.tags.$select(body.name).fetch();

  console.log("tags " , result);
  return result.following;
});
