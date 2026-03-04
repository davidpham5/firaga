import crypto from 'crypto'

/**
 * Payload beforeChange hook.
 *
 * Computes a SHA-256 content identifier (CID) from the canonical fields of a
 * record. The CID proves a record hasn't changed since it was first hashed —
 * the core verifiability primitive of the PDS.
 *
 * Which fields are included in the hash is intentionally stable. Adding a
 * field to canonicalFields is a breaking change that produces a new CID for
 * all existing records — do it deliberately and bump pdsVersion on the
 * Organization when you do.
 */

type CanonicalFields = {
  title?: string
  slug?: string
  content?: unknown
  publishedAt?: string
  lexiconType?: string
}

export function computeCID(canonicalFields: CanonicalFields): string {
  const stable = JSON.stringify(canonicalFields, Object.keys(canonicalFields).sort())
  return crypto.createHash('sha256').update(stable, 'utf8').digest('hex')
}

/** Drop-in Payload beforeChange hook — attach to any content collection. */
export const computeCIDHook = ({ data }: { data: Record<string, unknown> }) => {
  const fields: CanonicalFields = {
    title: data.title as string | undefined,
    slug: data.slug as string | undefined,
    content: data.content,
    publishedAt: data.publishedAt as string | undefined,
    lexiconType: data.lexiconType as string | undefined,
  }

  data.cid = computeCID(fields)
  return data
}
