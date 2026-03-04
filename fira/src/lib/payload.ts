/**
 * Payload API client.
 *
 * Thin wrapper around the Payload REST API. Used in Astro SSR pages and
 * API routes. All requests are server-side — no API keys exposed to the
 * browser.
 *
 * Usage:
 *   import { payload } from '@/lib/payload'
 *   const posts = await payload.find('posts', { where: { status: { equals: 'published' } } })
 */

const PAYLOAD_URL = import.meta.env.PAYLOAD_URL ?? 'http://localhost:3001'

type WhereClause = Record<string, unknown>

interface FindOptions {
  where?: WhereClause
  limit?: number
  page?: number
  sort?: string
  depth?: number
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PAYLOAD_URL}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`Payload API error ${res.status} on ${path}`)
  }

  return res.json() as Promise<T>
}

export const payload = {
  /**
   * Find multiple documents in a collection.
   */
  find: <T = unknown>(collection: string, options: FindOptions = {}) => {
    const params = new URLSearchParams()

    if (options.limit) params.set('limit', String(options.limit))
    if (options.page) params.set('page', String(options.page))
    if (options.sort) params.set('sort', options.sort)
    if (options.depth !== undefined) params.set('depth', String(options.depth))
    if (options.where) params.set('where', JSON.stringify(options.where))

    const qs = params.toString()
    return apiFetch<{ docs: T[]; totalDocs: number; totalPages: number; page: number }>(
      `/${collection}${qs ? `?${qs}` : ''}`
    )
  },

  /**
   * Find a single document by ID.
   */
  findById: <T = unknown>(collection: string, id: string, depth = 1) =>
    apiFetch<T>(`/${collection}/${id}?depth=${depth}`),

  /**
   * Find a single document by a field value. Returns the first match.
   */
  findOne: async <T = unknown>(
    collection: string,
    where: WhereClause,
    depth = 1
  ): Promise<T | null> => {
    const result = await payload.find<T>(collection, { where, limit: 1, depth })
    return result.docs[0] ?? null
  },
}
