import type { CollectionConfig } from "payload";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "bio",
      type: "textarea",
    },
    {
      name: "socialLinks",
      type: "group",
      fields: [
        {
          name: "twitter",
          label: "X / Twitter URL",
          type: "text",
        },
        {
          name: "linkedin",
          label: "LinkedIn URL",
          type: "text",
        },
        {
          name: "website",
          label: "Personal Website URL",
          type: "text",
        },
      ],
    },
  ],
};
