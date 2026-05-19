# CMS Scaffolding

> Production-ready Next.js CMS starter — build company profiles, blogs, product catalogs, or any content-driven website in minutes.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)

A full-stack, headless CMS with an integrated admin panel built with Next.js 15, Prisma, NextAuth v5, and Tailwind CSS.

---

## Tech Stack

| Layer      | Technology                       |
| ---------- | -------------------------------- |
| Framework  | Next.js 15 (App Router)          |
| Language   | TypeScript 5 (strict)            |
| Database   | PostgreSQL via Prisma 5          |
| Auth       | NextAuth v5 (JWT, Credentials)   |
| Styling    | Tailwind CSS 3.4 + CSS variables |
| Validation | Zod + react-hook-form            |
| Password   | argon2                           |
| Icons      | lucide-react                     |
| ORM        | Prisma                           |

---

## Project Structure

```
.
├── app/
│   ├── (public)/          # Public-facing website (home, about, blog, products, contact)
│   ├── admin/             # CMS admin panel
│   │   ├── dashboard/
│   │   ├── posts/
│   │   ├── pages/
│   │   ├── categories/
│   │   ├── media/
│   │   ├── users/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/          # NextAuth handler
│   │   └── admin/         # REST API routes (pages, posts, categories, media, users, settings, dashboard)
│   └── login/
├── components/
│   ├── admin/             # Admin-specific components
│   ├── public/            # Public header/footer
│   └── ui/                # Headless UI primitives (shadcn/ui pattern)
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── db.ts              # Prisma singleton
│   ├── permissions.ts     # RBAC helpers
│   ├── utils.ts           # Shared utilities
│   ├── services/          # Data-access layer
│   └── validators/        # Zod schemas
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── middleware.ts           # Route protection
├── types/
│   └── index.ts           # Global types + session augmentation
└── public/
    ├── uploads/           # File upload directory
    ├── robots.txt
    └── sitemap.xml
```

---

## Installation

### Prerequisites

- Node.js ≥ 20
- PostgreSQL ≥ 15
- pnpm (recommended) or npm

### Steps

```bash
# 1. Clone and install dependencies
git clone https://github.com/wahIndra/CMS-Scaffolding.git
cd CMS-Scaffolding
pnpm install

# 2. Copy environment file and fill in values
cp .env.example .env

# 3. Create the uploads directory
mkdir -p public/uploads

# 4. Run database migrations
pnpm db:migrate

# 5. Seed the database with default data
pnpm db:seed

# 6. Start development server
pnpm dev
```

---

## Environment Variables

Copy `.env.example` to `.env` and set the following:

```env
# Required
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cms_db"
NEXTAUTH_SECRET="your-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Optional: File uploads
UPLOAD_DIR="public/uploads"
UPLOAD_MAX_SIZE="5242880"  # 5 MB in bytes
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/webp,image/gif"

# Public
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="My CMS Site"
```

---

## Database

```bash
# Generate Prisma client after schema changes
pnpm db:generate

# Create and apply a new migration
pnpm db:migrate

# Seed the database (admin user + demo content)
pnpm db:seed

# Open Prisma Studio (GUI)
pnpm db:studio

# Reset database (drops all data)
pnpm db:reset
```

---

## Development

```bash
pnpm dev      # Start dev server on http://localhost:3000
pnpm build    # Production build
pnpm start    # Start production server
```

---

## Default Admin Credentials

After seeding, log in at `http://localhost:3000/login`:

| Field    | Value               |
| -------- | ------------------- |
| Email    | `admin@example.com` |
| Password | `Admin@12345`       |

> **Important:** Change the default password immediately after first login.

---

## User Roles & Permissions

| Role          | Permissions                           |
| ------------- | ------------------------------------- |
| `SUPER_ADMIN` | Full access to everything             |
| `ADMIN`       | Manage content, users, view dashboard |
| `EDITOR`      | Manage content, view dashboard        |
| `VIEWER`      | View dashboard only                   |

---

## API Routes

All admin API routes are under `/api/admin/` and require authentication.

| Method           | Endpoint                     | Description                |
| ---------------- | ---------------------------- | -------------------------- |
| GET/POST         | `/api/admin/pages`           | List / create pages        |
| GET/PATCH/DELETE | `/api/admin/pages/[id]`      | Get / update / delete page |
| GET/POST         | `/api/admin/posts`           | List / create posts        |
| PATCH/DELETE     | `/api/admin/posts/[id]`      | Update / delete post       |
| GET/POST         | `/api/admin/categories`      | List / create categories   |
| PATCH/DELETE     | `/api/admin/categories/[id]` | Update / delete category   |
| GET/POST         | `/api/admin/media`           | List / upload files        |
| DELETE           | `/api/admin/media/[id]`      | Delete media item          |
| GET/POST         | `/api/admin/users`           | List / create users        |
| GET/PATCH/DELETE | `/api/admin/users/[id]`      | Get / update / delete user |
| GET/POST         | `/api/admin/settings`        | Get / update site settings |
| GET              | `/api/admin/dashboard/stats` | Dashboard statistics       |

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Add environment variables (all from `.env`)
4. Set `UPLOAD_PROVIDER=s3` and configure S3 variables for production file storage
5. Deploy

### Docker / Self-hosted

```bash
pnpm build
pnpm start
```

Ensure `DATABASE_URL` points to your production PostgreSQL instance.

---

## Security Checklist

- [x] Passwords hashed with argon2
- [x] JWT-based sessions (no database sessions)
- [x] Route-level authentication via Next.js middleware
- [x] Server-side permission checks (`requirePermission()`) on all admin routes
- [x] Input validation with Zod on all API endpoints
- [x] File upload: MIME type + size validation
- [x] SUPER_ADMIN accounts cannot be deleted via the UI
- [x] Users cannot delete their own account
- [ ] Add CSP headers in `next.config.ts` for production
- [ ] Enable 2FA for admin accounts (future)
- [ ] Rate-limit `/api/auth` endpoints (future)

---

## Future Enhancements

- Rich-text editor (Tiptap / Slate.js) for post/page content
- Image optimization & CDN integration (Cloudinary / S3)
- Two-factor authentication
- Email notifications (user invitations, password reset)
- Draft preview for posts and pages
- Audit log viewer in the admin UI
- API key management for headless usage
- Full-text search (Meilisearch / Typesense)

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

## Author

Made with ❤️ by [wahIndra](https://github.com/wahIndra)
