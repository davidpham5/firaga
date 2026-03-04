import type { CollectionConfig } from 'payload'

/**
 * PodcastFeeds — a podcast show.
 *
 * An organization can have multiple podcast feeds (e.g. a daily briefing and
 * a long-form investigative series). Each feed gets its own RSS endpoint at:
 *   /podcast/<feed-slug>/feed.xml
 *
 * The feed is immediately compatible with Apple Podcasts, Spotify, Overcast,
 * and every other podcast app — no app store submissions or platform accounts
 * required. This is the open protocol payoff for audio.
 */
export const PodcastFeeds: CollectionConfig = {
  slug: 'podcast-feeds',
  admin: {
    useAsTitle: 'title',
    group: 'Audio',
    defaultColumns: ['title', 'slug', 'organization'],
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
      admin: { description: 'Used in the RSS URL: /podcast/<slug>/feed.xml' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown in podcast directories. Keep under 4,000 characters.' },
    },
    {
      name: 'artwork',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Minimum 1400×1400px, maximum 3000×3000px. Required by Apple.' },
    },
    {
      name: 'author',
      type: 'text',
      admin: { description: 'Shown as the podcast author in directories. e.g. "The Dispatch"' },
    },
    {
      name: 'ownerEmail',
      type: 'email',
      admin: { description: 'Used by Apple Podcasts for ownership verification. Not public.' },
    },

    // iTunes-specific metadata
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'News', value: 'News' },
        { label: 'News / Daily News', value: 'News:Daily News' },
        { label: 'News / Politics', value: 'News:Politics' },
        { label: 'Society & Culture', value: 'Society & Culture' },
        { label: 'Education', value: 'Education' },
        { label: 'Business', value: 'Business' },
        { label: 'Technology', value: 'Technology' },
        { label: 'True Crime', value: 'True Crime' },
        { label: 'Arts', value: 'Arts' },
      ],
      defaultValue: 'News',
    },
    {
      name: 'language',
      type: 'text',
      defaultValue: 'en',
      admin: { description: 'ISO 639-1 language code. e.g. "en", "es", "fr"' },
    },
    {
      name: 'explicit',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
  ],
}
