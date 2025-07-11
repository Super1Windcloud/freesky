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

    const result = await client.v1.statuses.$select(body.id).favourite();
    // console.log(result);
    if (!result) {
        throw new Error("Account not found");
    } else {
        return {
            success: true,
            message: `Account found with ID ${body.id}`,
        };
    }
});
