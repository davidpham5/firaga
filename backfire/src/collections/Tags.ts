import type { CollectionConfig } from 'payload'

/**
 * Tags — content taxonomy shared across Posts and Episodes.
 *
 * Tags are organization-scoped. "Politics" at The Dispatch is a different tag
 * from "Politics" at another publication, even though they share a name.
 */
export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'slug', 'organization'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Shown on the tag archive page.' },
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
  ],
}
