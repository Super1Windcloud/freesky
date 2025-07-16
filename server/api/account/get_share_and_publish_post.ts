import { createRestAPIClient } from "masto";

export default defineEventHandler(async (event) =>
{
    const body = await readBody(event);
    const client = createRestAPIClient({
        url: body.url,
        accessToken: body.accessToken,
    });

    const result = [] as any[];
    const arr = [] as any[];

    const iterator: any = client.v1.accounts.$select(body.id).statuses.list({
        limit: 40,
        excludeReplies: false,  // 我们手动过滤更精确
        excludeReblogs: false,
    })


    for await (const status of iterator)
    {
        const isRepost = status.reblog !== null
        const isOriginal = status.reblog === null && status.inReplyToId === null
        if (isRepost || isOriginal)
        {
            result.push(status);
        }
        arr.push(status);


    }
    console.log("get share and publish post result", result.length);
    console.log("get share and publish post result", arr.length);
    return result;
});


