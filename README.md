# Arun Chandan

Public website for Dr Arun Chandan. Next.js renders the pages. WordPress at `http://ac.local` stores the copy, catalogues, and form submissions.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000. Copy `.env.example` to `.env.local` and set the WordPress application password and revalidate secret. Do not commit `.env.local`.

`WORDPRESS_PREVIEW_DRAFTS=true` shows draft pages while they are still in editorial review. Turn that off for a public launch so only published WordPress pages appear.

## WordPress

The `ac-content` plugin on the Local site registers articles, plants, courses, programmes, publications, events, and private submissions. Evergreen pages keep a public path such as `/about/lok-ayurveda`.

Form managers can read and export submissions in WP Admin under Arun Chandan → Submissions. Administrators edit content and settings there.

Publishing a page asks Next.js to refresh that path. The request goes to `http://127.0.0.1:3000/api/revalidate`.

## Phase 1 boundary

There is no shop, payment, chart order, membership, or online classroom. Course fees stay blank until an intake is confirmed. Official WhatsApp and Telegram links are not invented.
