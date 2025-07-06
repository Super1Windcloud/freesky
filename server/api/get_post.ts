export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const actorUrl = query.actor as string;

  if (!actorUrl) {
    throw createError({ statusCode: 400, statusMessage: "Missing actor URL" });
  }

  const federation = await createFederationInstance();
  const posts = await getRemoteActorAndPosts(federation, actorUrl);

  return { posts };
});
