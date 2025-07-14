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

  const paginator = await  client.v1.timelines.tag.$select(body.name).list()
  console.log("paginator", paginator);

  return paginator;
});
