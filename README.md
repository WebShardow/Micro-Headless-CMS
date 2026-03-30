# Micro Headless CMS (v2026-03-29 Updated)

ระบบจัดการเนื้อหา (CMS) แบบพกพา ที่ถูกอัปเกรดให้รองรับฟีเจอร์พอร์ตโฟลิโอทีมงาน และการจัดการนโยบายทางกฎหมายแบบ Dynamic เรียบร้อยแล้ว

---

## ⚡ วิธีการติดตั้ง/อัปเดต (Quick Start)
หากคุณต้องการอัปเกรดจากเวอร์ชันเก่า หรือติดตั้งใหม่ในเครื่องอื่น โปรดอ่าน:
👉 **[อ่านคู่มือการอัปเกรดที่นี่ (UPGRADE_GUIDE.md)](./UPGRADE_GUIDE.md)** 👈

---

## 🏗️ ฟีเจอร์ที่เพิ่มเข้ามาใหม่
- **Legal Compliance:** ระบบจัดการหน้า Privacy, Terms และ Cookies พร้อมเนื้อหามาตรฐาน PDPA
- **Staff Accent Colors:** เพิ่มตัวเลือกสีเพื่อปรับแต่งโปรไฟล์ทีมงานให้สวยงามขึ้น 4 สี
- **ID/Slug API Resolver:** พัฒนา API ให้รองรับการค้นหาหน้าเพจด้วย Slug โดยตรง
- **Portfolio Repository:** จัดการลิงก์ GitHub, Demo และ Landing สำหรับโปรเจกต์ทีมงานได้แยกย่อย

This repository is the content backend, not the public frontend. It manages structured content, admin workflows, authentication, media, extension discovery, and API delivery for one or more frontend applications.

## What this project is
- Headless CMS backend
- Admin panel for content operations
- API source for frontend apps such as `Micro-Team`
- Reusable content system for projects, staff, pages, categories, menu items, media, and site configuration
- Extension-ready framework with isolated runtime packages

## What this project is not
- A single-site frontend application
- A Vercel-only product
- A GitHub-only automation product
- A portfolio website coupled to one frontend design

## Core philosophy
- Manage content here, render it elsewhere
- Keep data models reusable across multiple frontends
- Prefer portable architecture over provider convenience
- Treat GitHub and Vercel as optional tools, not platform foundations
- Keep optional extensions isolated from the framework core

## Current modules
- Dashboard
- Projects
- Staff Members
- Staff Repositories (Portfolio Manager)
- Pages
- Categories
- Media Library
- Navigation
- Site Config
- Site Design
- Extensions
- Backup & Restore

## Tech stack
- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL-compatible database
- Tailwind CSS

## Installation
### 1. Clone and install
```bash
npm install
```

### 2. Configure environment
Create `.env.local` from `.env.example` and set at minimum:
```env
DATABASE_URL=postgresql://...
EXTENSIONS_DIR=extensions
EXTENSIONS_WRITE_ENABLED=false
```

### 3. Sync database schema
```bash
npx prisma db push
npx prisma generate
```

### 4. Run locally
```bash
npm run dev
```

### 5. First-time setup
Open:
```text
http://localhost:3000/setup
```
Create the initial admin account, then log in through:
```text
http://localhost:3000/login
```

## Extension model
Extensions are designed to stay outside the core framework.

Rules:
- install extensions into `extensions/`
- never install third-party packages into the core `modules/` tree
- require `extension.json` with an API version
- prefer manual production install for trusted packages
- use ZIP upload only as an optional convenience path

See:
- `extensions/README.md`
- `docs/SELF_HOSTING.md`

## Deployment philosophy
This project should stay deployable on multiple targets:
- Vercel
- traditional Node hosting
- Docker / Docker Compose
- VPS or self-hosted platforms such as Coolify, Dokploy, or CapRover

Deployment platform is an implementation choice, not a product requirement.

## Self-host roadmap
The intended self-host path is:
1. PostgreSQL-compatible database
2. env-based configuration
3. Prisma schema sync or migrations
4. Node runtime or container runtime
5. optional reverse proxy and storage strategy

Included files:
- `Dockerfile`
- `docker-compose.yml`
- `docs/SELF_HOSTING.md`

Recommended future additions:
- storage adapter strategy for local disk / S3-compatible storage
- migration-first production workflow
- install script / bootstrap script
- extension compatibility tooling

## Frontend relationship
`Micro-Team` is one frontend consumer of this backend. Use the **Staff Members** module to edit profiles and the nested **Portfolio Manager** to link projects to each member.

That means:
- frontend routes should live in frontend repositories
- this backend should expose stable content APIs
- admin modules should describe content types, not one specific website layout

## Project rules
The architecture rules and long-term guardrails are documented in:
- `.agent/context.md`
- `.agent/goals.md`
- `.agent/rules.md`
- `.agent/architecture.md`
- `.agent/principles.md`
- `.agent/agent-handoff.md`
- `.agent/TASKS.md`
- `.agent/current-state.md`

## Current direction
- strengthen dashboard as a real system overview
- keep editors in dedicated modules
- remove backend preview responsibilities
- improve portability and self-host readiness
- prepare the project for public distribution
- build an extension system that remains isolated from the core framework
