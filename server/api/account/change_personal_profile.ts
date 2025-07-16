import { createRestAPIClient } from "masto";

 


export default defineEventHandler(async (event) =>
{
    const body = await readBody(event);
    const client = createRestAPIClient({
        url: body.url,
        accessToken: body.accessToken,
    });


    
    let result = await client.v1.accounts.updateCredentials({
        displayName: body.displayName,
        discoverable: body.discoverable,
        bot: body.bot,
        note: body.note,
        hideCollections: body.hideCollections,
        fieldsAttributes: body.fieldsAttributes,
    });

    if (Object.keys(result).length === 0)
    {
        console.error("更新个人资料失败", result);
        throw new Error("更新个人资料失败");
    } else
    { 
        console.log("更新个人资料成功", result);
        return true;
    }
});


