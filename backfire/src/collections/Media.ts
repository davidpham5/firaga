import type { CollectionConfig } from 'payload'

/**
 * Media — images, audio files, PDFs, and other uploads.
 *
 * In dev, files are stored locally in `public/media`.
 * In production, files are stored in Cloudflare R2 via the S3 adapter
 * configured in payload.config.ts.
 *
 * The `credit` field is journalism-specific: every image should have a
 * photographer credit. It's exposed on image embeds in the editor.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    group: 'Content',
  },
  upload: {
    // Static files served from /media in dev
    staticDir: '../public/media',
    // Image sizes auto-generated for responsive use
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 432, position: 'centre' },
      { name: 'feature', width: 1200, height: 675, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'audio/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Alt text for screen readers and SEO.' },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Shown below the image on the page.' },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photographer / source credit. e.g. "Photo: Jane Smith"' },
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      admin: { description: 'Scopes this media to an organization.' },
    },
  ],
}
