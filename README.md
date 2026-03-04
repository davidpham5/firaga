# Firaga

> Democratic infrastructure for journalism, unions, and community organizing.

Firaga is a cooperative publishing platform that gives newsrooms, labour organizations, and community groups the tools to create, distribute, and own their work. Every organization gets a **Personal Data Server (PDS)** — a portable, verifiable archive of everything they produce. The platform is built as a cooperative, not a SaaS: the organizations that use it own and govern it.

---

## What it does

- **Publish** — articles, static pages, rich media
- **Newsletter** — email campaigns to subscribers, audience segmentation
- **Podcast** — native audio episodes with RSS feeds compatible with every podcast app
- **Editorial workflow** — story pitching, assignment desk, review and approval
- **Distribute** — web, email, RSS, ActivityPub (Fediverse), AT Protocol (Bluesky)
- **Own your data** — every record has a content hash (CID) and a stable identity (DID); full PDS export at any time

Built for teams of 2–25: a two-person newsletter operation and a twenty-five-person local newsroom use the same platform, with complexity that reveals itself as the team grows.

---

## Organization types

| Type | Enabled tools |
|---|---|
| Newsroom | Publishing, newsletter, podcast, editorial workflow |
| Union / Labour org | All of the above + grievance tracking, member voting, contract library |
| Community org | All of the above + campaign management, events, canvassing |
| Hybrid | Any combination |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | [Astro](https://astro.build) v5 + React islands |
| Backend / CMS | [Payload CMS](https://payloadcms.com) v3 (Next.js 15) |
| Database | PostgreSQL 16 |
| Email (dev) | [maildev](https://github.com/maildev/maildev) |
| Email (production) | [Resend](https://resend.com) |
| Payments | Stripe |
| Storage | Cloudflare R2 |

---

## Repository structure

```
firaga/
├── docker-compose.yml   — local dev services (postgres, maildev)
├── backfire/            — Payload CMS v3 backend (API + admin UI)
│   └── src/
│       ├── collections/ — all data models
│       ├── hooks/       — CID hashing, DID assignment, rkey generation
│       └── app/         — Next.js app router (Payload admin + REST API)
└── fira/                — Astro frontend
    └── src/
        ├── lib/         — Payload API client
        └── pages/       — public site, setup wizard, dashboard
```

---

## Getting started

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/), Node.js ≥ 20

```bash
# 1. Start local services
docker compose up -d

# 2. Backend
cd backfire
cp .env.example .env
npm install
npm run generate:types
npm run dev
# → Payload admin at http://localhost:3001/admin

# 3. Frontend
cd ../fira
npm install
npm run dev
# → Astro site at http://localhost:4321

# 4. Email inbox (catches all outgoing email in dev)
# → http://localhost:1080
```

---

## PDS — Personal Data Server

Each organization in Firaga has a PDS: a self-contained, exportable store of everything they've produced. The concepts are borrowed from the [AT Protocol](https://atproto.com):

- **DID** — a stable decentralized identifier (`did:web:<slug>.firaga.io`) that is independent of the host
- **CID** — a SHA-256 content hash computed on every save, making records verifiable and tamper-evident
- **rkey** — a stable record key that identifies a record within its collection across exports and imports
- **Lexicon** — namespaced record types (`app.firaga.post`, `app.firaga.episode`, etc.) that make exports readable by any compatible tool

A full PDS export is a portable archive: posts, pages, newsletters, members, episodes, and their full history. Import it anywhere.

---

## Cooperative model

Firaga is built as a multi-stakeholder cooperative. The organizations that use it — newsrooms, union locals, community groups — are member-owners with governance rights, not customers. Founding members co-develop the platform's tools and data format.

---

## License

TBD — open source license to be determined with founding member input.
