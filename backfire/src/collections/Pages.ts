import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { computeCIDHook } from '../hooks/computeCID'
import { assignRkeyHook } from '../hooks/assignRkey'

/**
 * Pages — static pages like About, Contact, Support Us, etc.
 *
 * Unlike Posts, Pages don't have an editorial workflow. They are either
 * published or draft. They appear in site navigation, not the post feed.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'status', 'organization'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'showInNavigation',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'navigationLabel',
      type: 'text',
      admin: { description: 'Override the title in the nav menu. Leave blank to use title.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },

    // PDS record fields
    {
      name: 'cid',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'rkey',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'lexiconType',
      type: 'text',
      defaultValue: 'app.firaga.page',
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeChange: [assignRkeyHook, computeCIDHook],
  },
}
