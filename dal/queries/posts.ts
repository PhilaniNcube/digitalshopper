import "server-only";

import { getPayload } from "payload";
import config from "@payload-config";

export async function fetchPublishedPosts() {
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
}

export async function fetchPostBySlug(slug: string) {
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
}
