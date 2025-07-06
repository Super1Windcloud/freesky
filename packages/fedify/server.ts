import {
  createFederation,
  Follow,
  MemoryKvStore,
  Person,
  exportJwk,
  generateCryptoKeyPair,
  importJwk,
} from "@fedify/fedify";

import { openKv } from "@deno/kv";

const kv = await openKv();

export async function createFederationInstance() {
  const federation = createFederation<void>({
    kv: new MemoryKvStore(),
  });
  federation
    .setActorDispatcher("/users/{identifier}", async (ctx, identifier) => {
      if (identifier !== "me") return null;
      return new Person({
        id: ctx.getActorUri(identifier),
        name: "Me", // Display name
        summary: "This is me!", // Bio
        preferredUsername: identifier, // Bare handle
        url: new URL("/", ctx.url),
        inbox: ctx.getInboxUri(identifier),
      });
    })
    .setKeyPairsDispatcher(async (ctx, identifier) => {
      if (identifier != "me") return []; // Other than "me" is not found.
      const entry = await kv.get<{
        privateKey: JsonWebKey;
        publicKey: JsonWebKey;
      }>(["key"]);
      if (entry == null || entry.value == null) {
        // Generate a new key pair at the first time:
        const { privateKey, publicKey } =
          await generateCryptoKeyPair("RSASSA-PKCS1-v1_5");
        // Store the generated key pair to the Deno KV database in JWK format:
        await kv.set(["key"], {
          privateKey: await exportJwk(privateKey),
          publicKey: await exportJwk(publicKey),
        });
        return [
          {
            privateKey,
            publicKey,
          },
        ];
      }
      // Load the key pair from the Deno KV database:
      const privateKey = await importJwk(entry.value.privateKey, "private");
      const publicKey = await importJwk(entry.value.publicKey, "public");
      return [
        {
          privateKey,
          publicKey,
        },
      ];
    });

  federation
    .setInboxListeners("/users/{identifier}/inbox", "/inbox")
    .on(Follow, async (ctx, follow) => {
      if (
        follow.id == null ||
        follow.actorId == null ||
        follow.objectId == null
      ) {
        return;
      }
      const parsed = ctx.parseUri(follow.objectId);
      if (parsed?.type !== "actor" || parsed.identifier !== "me") return;
      const follower = await follow.getActor(ctx);
      console.debug(follower);
    });

  // ;
  return federation;
}
