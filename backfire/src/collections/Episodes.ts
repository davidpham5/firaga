import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { computeCIDHook } from '../hooks/computeCID'
import { assignRkeyHook } from '../hooks/assignRkey'

/**
 * Episodes — individual podcast episodes.
 *
 * An Episode is a first-class content type alongside Post. It has an audio
 * file, show notes (the "article" for the episode), and a transcript.
 *
 * The transcript is not optional by design. For a journalism platform:
 *   - It makes audio content accessible
 *   - It makes episodes indexable by search engines
 *   - It travels with the episode in the PDS export (the archive is complete)
 *
 * The `linkedPost` field connects an episode to its written counterpart when
 * the same story exists in both formats.
 */
export const Episodes: CollectionConfig = {
  slug: 'episodes',
  admin: {
    useAsTitle: 'title',
    group: 'Audio',
    defaultColumns: ['title', 'feed', 'status', 'publishedAt'],
  },
  fields: [
    // Core
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

    // Show notes — the full "article" version of the episode
    {
      name: 'showNotes',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: { description: 'Published on the episode page and in the RSS <description> field.' },
    },

    // Transcript — required for accessibility, SEO, and archive completeness
    {
      name: 'transcript',
      type: 'textarea',
      admin: {
        description:
          'Full transcript. Required for accessibility and to make audio searchable. ' +
          'Auto-transcription via Whisper API coming in a future release.',
      },
    },

    // Audio file
    {
      name: 'audioFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'duration',
      type: 'text',
      admin: { description: 'Human-readable duration. e.g. "45:32" or "1:02:15"' },
    },

    // Episode metadata
    {
      name: 'episodeNumber',
      type: 'number',
    },
    {
      name: 'season',
      type: 'number',
    },
    {
      name: 'episodeType',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full episode', value: 'full' },
        { label: 'Trailer', value: 'trailer' },
        { label: 'Bonus', value: 'bonus' },
      ],
    },
    {
      name: 'explicit',
      type: 'checkbox',
      defaultValue: false,
    },

    // Status
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },

    // Relationships
    {
      name: 'feed',
      type: 'relationship',
      relationTo: 'podcast-feeds',
      required: true,
    },
    {
      name: 'linkedPost',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        description: 'Optional. Links this episode to its written counterpart.',
      },
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
      defaultValue: 'app.firaga.episode',
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeChange: [assignRkeyHook, computeCIDHook],
  },
}
