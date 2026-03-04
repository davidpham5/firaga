import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Organizations } from './collections/Organizations'
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Members } from './collections/Members'
import { Tags } from './collections/Tags'
import { PodcastFeeds } from './collections/PodcastFeeds'
import { Episodes } from './collections/Episodes'
import { Stories } from './collections/Stories'
import { Newsletters } from './collections/Newsletters'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // ─── Admin UI ─────────────────────────────────────────────────────────────
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Firaga',
      ogImage: '/og-image.png',
      favicon: '/favicon.ico',
    },
  },

  // ─── Collections ──────────────────────────────────────────────────────────
  collections: [
    // Platform
    Organizations,
    Users,
    Media,
    // Content
    Posts,
    Pages,
    Tags,
    // Audio
    PodcastFeeds,
    Episodes,
    // Editorial workflow
    Stories,
    Newsletters,
    // Audience
    Members,
  ],

  // ─── Default rich text editor ─────────────────────────────────────────────
  editor: lexicalEditor({}),

  // ─── Database ─────────────────────────────────────────────────────────────
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? 'postgresql://firaga:firaga@localhost:5432/firaga',
    },
  }),

  // ─── Auth secret ──────────────────────────────────────────────────────────
  secret: process.env.PAYLOAD_SECRET ?? 'dev-secret-change-in-production',

  // ─── TypeScript output ────────────────────────────────────────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ─── GraphQL ──────────────────────────────────────────────────────────────
  graphQL: {
    schemaOutputFile: path.resolve(dirname, '../schema.graphql'),
  },

  // ─── CORS ─────────────────────────────────────────────────────────────────
  // Astro dev server at 4321, backfire at 3001
  cors: [
    process.env.FRONTEND_URL ?? 'http://localhost:4321',
    'http://localhost:3001',
  ],

  // ─── Uploads ──────────────────────────────────────────────────────────────
  // In production, swap localDisk for @payloadcms/storage-s3 pointing at R2.
  // See: https://payloadcms.com/docs/upload/storage-adapters
  upload: {
    limits: {
      fileSize: 524_288_000, // 500 MB — accommodates large audio files
    },
  },
})
