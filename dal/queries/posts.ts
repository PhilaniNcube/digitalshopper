import "server-only";

import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

export const fetchPublishedPosts = cache(async () => {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "posts",
    where: {
      status: { equals: "published" },
    },
    sort: "-publishedAt",
    depth: 1,
  });

  return result.docs;
});

export const fetchPostBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "posts",
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
    depth: 2,
    limit: 1,
  });

  return result.docs[0] ?? null;
});

