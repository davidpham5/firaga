import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { computeCIDHook } from '../hooks/computeCID'
import { assignRkeyHook } from '../hooks/assignRkey'

/**
 * Newsletters — email campaigns sent to Members.
 *
 * A Newsletter is the email form of a story or a collection of stories.
 * It may be identical to an article, a digest of recent posts, or a
 * standalone piece written specifically for email.
 *
 * Sending is handled by the Resend API (wired up in a separate service layer).
 * This collection is the record of what was composed, scheduled, and sent.
 */
export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  admin: {
    useAsTitle: 'subject',
    group: 'Editorial',
    defaultColumns: ['subject', 'status', 'sendAt', 'sentAt'],
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'previewText',
      type: 'text',
      admin: {
        description:
          'The line shown after the subject in email clients. ' +
          'Keep under 100 characters for best display.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
    },

    // Sender identity — defaults to organization settings, can override per-send
    {
      name: 'fromName',
      type: 'text',
      admin: { description: 'Sender name. Defaults to organization name if blank.' },
    },
    {
      name: 'replyTo',
      type: 'email',
    },

    // Audience targeting
    {
      name: 'audience',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All members', value: 'all' },
        { label: 'Free members only', value: 'free' },
        { label: 'Paid members only', value: 'paid' },
      ],
    },

    // Status and scheduling
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sending', value: 'sending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'sendAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Schedule a future send. Leave blank to send immediately.',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: { readOnly: true },
    },

    // Engagement metrics (populated after send)
    {
      name: 'recipientCount',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'openCount',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'clickCount',
      type: 'number',
      admin: { readOnly: true },
    },

    // Linked posts (optional — newsletters can reference articles)
    {
      name: 'linkedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: { description: 'Posts featured in this newsletter issue.' },
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
      defaultValue: 'app.firaga.newsletter',
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeChange: [assignRkeyHook, computeCIDHook],
  },
}
