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

  const suggestions = await client.v1.suggestions.list();
  // console.log("suggestions", suggestions);
  let count = 0;
  let result  : any[]  = [];
  while (count < 5) {
    let item = suggestions[count];
    count += 1;
    result.push({
      id: item.id,
      username: item.username.trim(),
      acct: item.acct.trim(),
      displayName: item.displayName.trim(),
      avatar: item.avatar,
    });
  }
  return result;
});
