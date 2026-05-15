# Veya Recruit Suite

Veya is a recruitment workspace for managing resume intake, candidate parsing,
client submissions, vendor queues, status flow, and notifications.

Built for Closing Gap.

## Current Build

- React + TypeScript + Vite
- Polished internal recruiter dashboard
- Full frontend-only module shell
- Closing Gap login page with local role workflow
- Resume upload/parsing simulation
- Candidate profile review
- Client-safe PDF preview state
- Client account and client portal preview
- Vendor account and vendor submission desk
- Job requirement board with assignment matrix
- Reports view with activity and connection plan
- Client submission queue
- Vendor queue
- Clickable candidate status flow
- Notification feed with local state

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Next Product Steps

- Review the frontend workflow in Vercel.
- Add authentication and role permissions for admin, HR, client, and vendor users.
- Add backend database schema for candidates, clients, vendors, jobs, submissions,
  activity history, and notifications.
- Connect Google Drive for original resume storage.
- Add PDF extraction, OCR fallback, and structured resume parsing.
- Generate real downloadable client-safe PDFs from sanitized candidate data.
- Connect Gmail for workflow notifications.

## Connection Plan

Use Supabase for database/auth, Google Shared Drive for original resumes and
client PDFs, and Gmail API for workflow email. See
`docs/connection-workflow.md`.
