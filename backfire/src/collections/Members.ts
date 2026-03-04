import type { CollectionConfig } from 'payload'

/**
 * Members — readers and subscribers of a publication.
 *
 * Distinct from Users (staff). A Member is an audience member: they subscribe
 * to newsletters, access gated content, and may pay for membership.
 *
 * Member data is the most portable part of the PDS. When a publisher migrates
 * platforms, their member list must come with them — no re-subscribing,
 * no lost relationships.
 */
export const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'email',
    group: 'Audience',
    defaultColumns: ['email', 'name', 'status', 'source', 'createdAt'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Paid', value: 'paid' },
        { label: 'Comped (complimentary)', value: 'comped' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'signup',
      options: [
        { label: 'Signed up on site', value: 'signup' },
        { label: 'Imported', value: 'import' },
        { label: 'Invited by staff', value: 'invited' },
        { label: 'Paid subscription', value: 'paid_signup' },
      ],
      admin: { description: 'How this member joined. Preserved on import for provenance.' },
    },

    // Newsletter preferences
    {
      name: 'newsletterSubscribed',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: { readOnly: true },
    },

    // Stripe integration (populated when a paid subscription is created)
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Stripe customer ID. Set automatically on paid signup.',
      },
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      admin: { readOnly: true },
    },

    // Organization scoping
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },

    // Notes (staff-only, never shown to the member)
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal notes. Not visible to the member.' },
    },

    // PDS record fields
    {
      name: 'rkey',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'lexiconType',
      type: 'text',
      defaultValue: 'app.firaga.member',
      admin: { readOnly: true },
    },
  ],
}
