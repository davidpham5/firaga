import type { CollectionConfig } from 'payload'

/**
 * Users — journalists, editors, producers, and platform staff.
 *
 * Distinct from Members (readers/subscribers). A User is someone who logs
 * into the dashboard and produces content. A Member is someone who reads it.
 *
 * Roles are scoped to an Organization. A user can only belong to one
 * organization in this version (multi-org support is a future concern).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    group: 'Platform',
    defaultColumns: ['name', 'email', 'role', 'organization'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    // Role within their organization
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'reporter',
      options: [
        { label: 'Owner / Publisher', value: 'owner' },
        { label: 'Editor', value: 'editor' },
        { label: 'Reporter / Journalist', value: 'reporter' },
        { label: 'Contributor (freelance/guest)', value: 'contributor' },
        { label: 'Photographer / Visual', value: 'photographer' },
        { label: 'Audio Producer', value: 'audio_producer' },
        { label: 'Platform Admin', value: 'platform_admin' },
      ],
    },

    // Which organization this user belongs to
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      admin: {
        description: 'The organization this user is a staff member of.',
      },
    },

    // Profile
    {
      name: 'bio',
      type: 'textarea',
      admin: { description: 'Displayed on byline pages.' },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'pronouns',
      type: 'text',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Mastodon', value: 'mastodon' },
            { label: 'Bluesky', value: 'bluesky' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Website', value: 'website' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'url', type: 'text' },
        { name: 'label', type: 'text', admin: { description: 'e.g. "@jane@mastodon.social"' } },
      ],
    },

    // Timestamps (Payload adds createdAt/updatedAt automatically)
    {
      name: 'lastActiveAt',
      type: 'date',
      admin: { readOnly: true },
    },
  ],
}
