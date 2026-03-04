/**
 * Payload beforeChange hook for the Organizations collection.
 *
 * Assigns a W3C DID (Decentralized Identifier) to a new organization on
 * creation. We start with did:web — the simplest DID method, derived from a
 * domain name. No external infrastructure required.
 *
 * did:web format:  did:web:<hostname>
 * Example:         did:web:the-dispatch.firaga.io
 *
 * The did:web spec requires a DID document to be served at:
 *   https://<hostname>/.well-known/did.json
 *
 * The Astro frontend serves this document for each publication's subdomain.
 * When a publisher connects a custom domain, the DID changes — a known
 * limitation of did:web. A future migration to did:plc would give persistent
 * identity through domain moves. The field is designed for that upgrade.
 */
export const assignDIDHook = ({
  data,
  operation,
}: {
  data: Record<string, unknown>
  operation: string
}) => {
  if (operation === 'create' && data.slug && !data.did) {
    const hostname = `${data.slug}.firaga.io`
    data.did = `did:web:${hostname}`
  }

  return data
}
