import path from "path";
import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Categories } from "./collections/Categories";
import { Tags } from "./collections/Tags";
import { Authors } from "./collections/Authors";
import { Media } from "./collections/Media";

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor(),
  collections: [Users, Categories, Tags, Authors, Media],
  plugins: [
    vercelBlobStorage({
      enabled: true,
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
      collections: {
        media: true,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET ?? "",
  db: sqliteAdapter({
    client: {
      url: process.env.TURSO_PAYLOAD_DATABASE_URL ?? process.env.TURSO_DATABASE_URL ?? "",
      authToken: process.env.TURSO_PAYLOAD_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN ?? "",
    },
    // Preserve existing numeric IDs from the previous Postgres Payload database
    // so migrated rows keep their primary keys.
    idType: "number",
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(process.cwd(), "payload-types.ts"),
  },
});
