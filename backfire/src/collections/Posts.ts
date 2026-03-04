import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { computeCIDHook } from '../hooks/computeCID'
import { assignRkeyHook } from '../hooks/assignRkey'

/**
 * Posts — the canonical written article record in the PDS.
 *
 * A Post is the unit of journalism: it has an author, a publication date,
 * a body, and a CID that proves its content hasn't changed since publishing.
 *
 * Status workflow:
 *   draft → inReview → approved → scheduled → published
 *
 * The `lexiconType` field marks this record's schema in the PDS:
 *   app.firaga.post
 *
 * This is what allows other tools to understand a Firaga PDS export without
 * needing Firaga-specific code.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'author', 'publishedAt'],
    preview: (doc) => {
      if (doc?.slug && doc?.organization?.slug) {
        return `http://localhost:4321/${doc.organization.slug}/${doc.slug}`
      }
      return null
    },
  },
  fields: [
    // Core content
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: { description: 'URL path segment. e.g. "the-state-of-local-news"' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Used in newsletter previews, social sharing, and RSS.' },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'coverImageCaption',
      type: 'text',
    },
    {
      name: 'coverImageCredit',
      type: 'text',
      admin: { description: 'Photo credit line. e.g. "Photo: Jane Smith / The Dispatch"' },
    },

    // Journalism-specific fields
    {
      name: 'dateline',
      type: 'text',
      admin: { description: 'Where and when reported. e.g. "CHICAGO, March 4 —"' },
    },
    {
      name: 'isBreaking',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isPremium',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'If true, content is gated to paid members.' },
    },

    // Corrections — append only, never overwrite published content
    {
      name: 'corrections',
      type: 'array',
      admin: {
        description:
          'Append a correction. Do not edit published text — add a correction here instead.',
      },
      fields: [
        { name: 'issuedAt', type: 'date', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },

    // Editorial status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In review', value: 'inReview' },
        { label: 'Approved', value: 'approved' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },

    // Attribution
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    // PDS record fields — all read-only, managed by hooks
    {
      name: 'cid',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'SHA-256 of canonical content fields. Computed on save.',
      },
    },
    {
      name: 'rkey',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Stable record key within this collection for the organization.',
      },
    },
    {
      name: 'lexiconType',
      type: 'text',
      defaultValue: 'app.firaga.post',
      admin: {
        readOnly: true,
        description: 'Namespaced record type. Used in PDS exports for interoperability.',
      },
    },
  ],
  hooks: {
    beforeChange: [assignRkeyHook, computeCIDHook],
  },
}
