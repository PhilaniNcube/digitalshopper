import path from "path";
import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Posts } from "./collections/Posts";
import { Categories } from "./collections/Categories";
import { Tags } from "./collections/Tags";
import { Authors } from "./collections/Authors";
import { Media } from "./collections/Media";

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor(),
  collections: [Users, Posts, Categories, Tags, Authors, Media],
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
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? "",
    },
    // All Payload tables are created in the 'payload' PostgreSQL schema,
    // keeping them completely isolated from the existing 'public' schema
    // where your ecommerce/auth tables live. This option is experimental.
    schemaName: "payload",
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(process.cwd(), "payload-types.ts"),
  },
});
