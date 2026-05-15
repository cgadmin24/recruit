# TruHyre Connection Workflow

This project is currently frontend-only. APIs and secrets should be connected
after the Vercel deployment is reviewed.

## Chosen Defaults

- Company: Closing Gap
- Support account: support@theclosinggap.net
- Google Workspace domain: theclosinggap.net
- Database/Auth recommendation: Supabase
- File storage recommendation: Google Shared Drive
- Email recommendation: Gmail API from support@theclosinggap.net first, then
  optional recruiter-specific sending later

## Login Workflow

1. User lands on the Closing Gap sign-in page.
2. User chooses login mode: Magic link or Password.
3. User chooses role: Admin, HR, Client, or Vendor.
4. Local demo session opens the relevant workspace:
   - Admin and HR open Pipeline
   - Client opens Client Portal
   - Vendor opens Vendor Portal
5. Later, Supabase Auth will replace the local session.

## Product Workflow

1. HR or vendor uploads resume PDF.
2. System extracts text and allocates candidate fields.
3. HR reviews duplicate checks and internal candidate profile.
4. Original resume is stored privately in Google Drive.
5. System generates a client-safe candidate PDF.
6. Candidate is submitted to the client portal.
7. Client gives feedback: Shortlist, Reject, Interview, or Hold.
8. Candidate stage updates notify assigned users.

## API Connection Order

1. Supabase project, database schema, auth roles, and row-level security.
2. Google OAuth app for Workspace domain.
3. Google Drive root folder or Shared Drive integration.
4. Gmail API sender integration.
5. PDF extraction and OCR worker.
6. AI resume parser.
7. Real downloadable client-safe PDF generation.
8. Vercel production environment variables.

## Security Notes

- Do not commit passwords, API keys, client secrets, tokens, or database URLs.
- Use Vercel environment variables for production secrets.
- Use `.env.local` locally and keep it ignored by Git.
- Gmail mailbox passwords should not be used by the app; use OAuth/API access.
