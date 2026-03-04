import type { CollectionConfig } from 'payload'
import { assignDIDHook } from '../hooks/assignDID'

/**
 * Organizations — the PDS container.
 *
 * One Organization per co-op member. Everything in the system belongs to an
 * Organization. The `did` field is the stable decentralized identifier for
 * the organization's data store.
 *
 * type + modules drive which features are visible in the UI:
 *   newsroom  → publishing, newsletter, podcast, editorial workflow
 *   union     → labor tools (grievances, voting, contract library)
 *   community → organizing tools (campaigns, events, canvassing)
 *   hybrid    → any combination
 */
export const Organizations: CollectionConfig = {
  slug: 'organizations',
  admin: {
    useAsTitle: 'name',
    group: 'Platform',
    defaultColumns: ['name', 'slug', 'type', 'status'],
  },
  fields: [
    // Identity
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-safe identifier. Becomes slug.firaga.io',
      },
    },
    {
      name: 'did',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Assigned automatically on creation. did:web:<slug>.firaga.io',
      },
    },

    // Profile
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'Short line used in SEO meta and social previews' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'accentColor',
      type: 'text',
      defaultValue: '#3B82F6',
      admin: { description: 'Hex color. Used for buttons, links, accents on the public site.' },
    },
    {
      name: 'font',
      type: 'select',
      options: [
        { label: 'Sans-serif (Inter)', value: 'sans' },
        { label: 'Serif (Lora)', value: 'serif' },
        { label: 'Monospace (JetBrains Mono)', value: 'mono' },
      ],
      defaultValue: 'sans',
    },

    // Organization type & active feature modules
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'newsroom',
      options: [
        { label: 'Newsroom', value: 'newsroom' },
        { label: 'Union / Labour org', value: 'union' },
        { label: 'Community org', value: 'community' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
    {
      name: 'modules',
      type: 'select',
      hasMany: true,
      defaultValue: ['publishing', 'newsletter'],
      options: [
        { label: 'Publishing (articles, pages)', value: 'publishing' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Podcast', value: 'podcast' },
        { label: 'Organizing (campaigns, events)', value: 'organizing' },
        { label: 'Labor (grievances, voting, contracts)', value: 'labor' },
        { label: 'Governance (minutes, resolutions)', value: 'governance' },
      ],
      admin: {
        description: 'Enabled features. Controls which tools are shown in the dashboard.',
      },
    },

    // Membership
    {
      name: 'membershipTier',
      type: 'select',
      defaultValue: 'founding',
      options: [
        { label: 'Founding member', value: 'founding' },
        { label: 'Full member', value: 'full' },
        { label: 'Associate member', value: 'associate' },
      ],
      admin: { description: 'Co-op membership class. Determines governance weight.' },
    },

    // Domain
    {
      name: 'customDomain',
      type: 'text',
      admin: { description: 'Optional. e.g. thedispatch.com. Requires DNS setup.' },
    },

    // Status
    {
      name: 'status',
      type: 'select',
      defaultValue: 'setup',
      options: [
        { label: 'Setup in progress', value: 'setup' },
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },

    // Ownership
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    // PDS metadata
    {
      name: 'pdsVersion',
      type: 'text',
      defaultValue: '1',
      admin: {
        readOnly: true,
        description: 'Version of the PDS export schema. Increment when the record format changes.',
      },
    },
  ],
  hooks: {
    beforeChange: [assignDIDHook],
  },
}
