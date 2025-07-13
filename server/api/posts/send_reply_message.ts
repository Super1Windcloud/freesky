import { createRestAPIClient } from "masto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const client = createRestAPIClient({
    url: body.url,
    accessToken: body.accessToken,
  });

  const result = await client.v1.statuses.create({
    status: body.content,
    inReplyToId: body.id,
  });

  // console.log("send reply message result:", result);
  return result;
});
