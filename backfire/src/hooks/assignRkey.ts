/**
 * Payload beforeChange hook.
 *
 * Assigns an rkey (record key) to a new content record. The rkey is a short,
 * URL-safe, time-sortable identifier that is unique within a collection for a
 * given organization. It is stable for the lifetime of the record.
 *
 * In AT Protocol, an rkey is the last path segment of a record URI:
 *   at://did:plc:abc123/app.firaga.post/<rkey>
 *
 * We use the same concept: the rkey is the record's address within its
 * collection in the PDS repo. It travels with the record in exports.
 *
 * Format: <base36 timestamp><5 random base36 chars>
 * Example: lzqh3abc1x
 */
export const assignRkeyHook = ({
  data,
  operation,
}: {
  data: Record<string, unknown>
  operation: string
}) => {
  if (operation === 'create' && !data.rkey) {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).slice(2, 7)
    data.rkey = `${timestamp}${random}`
  }

  return data
}
