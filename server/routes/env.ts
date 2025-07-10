


export default defineEventHandler(async () => {
  const env = {
    CLIENT_NAME: process.env.MastodonName,
    SCOPES: process.env.NUXT_PUBLIC_SCOPES,
    WEBSITE: process.env.NUXT_PUBLIC_REDIRECT_URI,
    REDIRECT_URI: process.env.NUXT_PUBLIC_WEBSITE,
  };
  console.log("request env from server" ,env)

  return env;
});
