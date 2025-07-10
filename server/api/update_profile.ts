import fs from "node:fs/promises";

import { createRestAPIClient } from "masto";


export default defineEventHandler(async (event) => {

    const masto = createRestAPIClient({
        url: "https://example.com",
        accessToken:  process.env.ACCESS_TOKEN,
    });

    const newProfile = await masto.v1.accounts.updateCredentials({
        displayName: "Fluffy elephant friend",
        note: "Hi fediverse!",
        avatar: new Blob([await fs.readFile("../some_image.png")]),
    });

    console.log(newProfile);

});

