# Monorepo Restructuring (api & web) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the repository into two independent sub-projects: `api/` (Express.js Clean Architecture backend) and `web/` (Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui frontend).

**Architecture:** The Express backend moves into `api/` with CORS enabled to serve API consumers and the web frontend. The Next.js frontend lives in `web/` with `src/` directory, implementing shadcn/ui components (`Card`, `Button`, `Input`, `Textarea`, `Tabs`, `Badge`, `Checkbox`, `Dialog/Sheet`, `Toast`) to recreate the full dashboard (Hero stats, Docs tab, interactive Playground, and TikTok-style Comment Drawer). Root package provides convenient scripts to run both.

**Tech Stack:** 
- Backend (`api/`): Node.js, Express, TypeScript, Clean Architecture, TSX, Vitest/Node test runner
- Frontend (`web/`): Next.js 14/15 (App Router), React 18/19, TypeScript, Tailwind CSS, shadcn/ui primitives, Lucide React, Plus Jakarta Sans, JetBrains Mono

**Spec:** `docs/superpowers/specs/2026-10-24-monorepo-restructure-nextjs-design.md`

## Global Constraints

- Backend Clean Architecture layers (`domain/`, `application/`, `infrastructure/`, `presentation/`) in `api/` must remain intact.
- All existing 8 automated test suites in backend must continue to pass 100%.
- Frontend must use Next.js App Router with `src/` directory and TypeScript.
- Design theme must match the official Alight Motion aesthetic: Midnight Navy (`#0d121f` & `#131927`) and Neon Mint (`#00e599`).
- Components must follow shadcn/ui structure with Radix UI / custom accessible primitives.
- Code block JSON syntax highlighting must stay dark developer style across all screens.

## Review Focus

1. CORS preflight failure: Next.js calling Express API on a different port (e.g. 3000 vs 3001) will fail if CORS headers are missing.
2. TikTok-style comment drawer: Mobile sheet slide-up animation and desktop sticky sidebar layout must be fully responsive.
3. Nested comment replies: Replies must render hierarchically under their parent comment with `[Anonim]` badge correctly styled.
4. Playground JSON output: Must correctly handle error responses (400, 500) and display formatted JSON without crashing.
5. Logo and asset paths: Must resolve cleanly via `NEXT_PUBLIC_API_URL` or public static assets in `web/public/`.

---

### Task 1: Move Express backend into `api/` and configure CORS

**Files:**
- Create/Move: `api/src/`, `api/test/`, `api/package.json`, `api/tsconfig.json`, `api/.env.example`
- Modify: `api/src/presentation/server.ts`
- Test: `api/test/api.test.ts`

**Interfaces:**
- Produces: Express API listening on port `PORT || 3000` with CORS headers enabled for frontend access.

- [ ] **Step 1: Create `api/` directory and move existing backend files**

Move `src/`, `test/`, `package.json`, `tsconfig.json`, `.env.example`, `drizzle.config.ts` into `api/`.

- [ ] **Step 2: Add `cors` middleware to `api/src/presentation/server.ts`**

Install `cors` and `@types/cors` in `api/` and configure `app.use(cors())`.

- [ ] **Step 3: Run backend automated tests**

Run: `cd api && npm test`
Expected: ALL 8 TEST SUITES PASS (100% green).

- [ ] **Step 4: Run backend TypeScript build**

Run: `cd api && npm run build`
Expected: Exited with code 0.

- [ ] **Step 5: Commit backend move**

```bash
git add api/
git commit -m "refactor(api): move express backend into api sub-project with cors enabled"
```

---

### Task 2: Initialize Next.js project in `web/` with TypeScript, Tailwind CSS & shadcn/ui foundation

**Files:**
- Create: `web/package.json`
- Create: `web/tsconfig.json`
- Create: `web/tailwind.config.ts`
- Create: `web/src/app/layout.tsx`
- Create: `web/src/app/globals.css`
- Create: `web/src/lib/utils.ts`
- Create: `web/src/lib/api.ts`
- Create: `web/src/components/ui/card.tsx`
- Create: `web/src/components/ui/button.tsx`
- Create: `web/src/components/ui/input.tsx`
- Create: `web/src/components/ui/textarea.tsx`
- Create: `web/src/components/ui/badge.tsx`
- Create: `web/src/components/ui/tabs.tsx`

**Interfaces:**
- Produces: `cn()` utility in `src/lib/utils.ts`, `apiClient` in `src/lib/api.ts`, and core shadcn/ui components (`Card`, `Button`, `Input`, `Textarea`, `Badge`, `Tabs`).

- [ ] **Step 1: Setup `web/package.json` with Next.js, React, Tailwind, and Radix UI / lucide dependencies**
- [ ] **Step 2: Configure `tailwind.config.ts` with Alight Motion colors (`midnight: #0d121f`, `cardBg: #131927`, `am-500: #00e599`, `am-400: #1affaa`)**
- [ ] **Step 3: Setup `src/lib/utils.ts` and `src/lib/api.ts` for communication with backend**
- [ ] **Step 4: Create shadcn/ui components (`card.tsx`, `button.tsx`, `input.tsx`, `textarea.tsx`, `badge.tsx`, `tabs.tsx`)**
- [ ] **Step 5: Run Next.js build to verify setup**

Run: `cd web && npm run build`
Expected: Compiled successfully with 0 errors.

- [ ] **Step 6: Commit web foundation**

```bash
git add web/
git commit -m "feat(web): initialize next.js app router with typescript and shadcn ui foundation"
```

---

### Task 3: Implement Header, Footer, Hero Quick Stats, and 2-Step Activation Cards

**Files:**
- Create: `web/src/components/layout/Header.tsx`
- Create: `web/src/components/layout/Footer.tsx`
- Create: `web/src/components/dashboard/HeroStats.tsx`
- Create: `web/src/components/dashboard/StepsCard.tsx`
- Modify: `web/src/app/page.tsx`

**Interfaces:**
- Consumes: `apiClient.getStats()` from `src/lib/api.ts`
- Produces: `Header`, `Footer`, `HeroStats`, `StepsCard` components rendered on `page.tsx`.

- [ ] **Step 1: Implement `Header.tsx` with logo, title badge "by Justdhif", and external social links (TikTok & WhatsApp)**
- [ ] **Step 2: Implement `Footer.tsx` with branding and copyright information**
- [ ] **Step 3: Implement `HeroStats.tsx` with 3 statistic cards (Total Aktivasi, Aktivasi Hari Ini, Protokol)**
- [ ] **Step 4: Implement `StepsCard.tsx` detailing the 2-step activation workflow with neon badge numbers**
- [ ] **Step 5: Run Next.js build to verify**

Run: `cd web && npm run build`
Expected: Compiled successfully.

- [ ] **Step 6: Commit header, footer, and hero components**

```bash
git add web/src/
git commit -m "feat(web): add header, footer, hero stats, and activation steps components"
```

---

### Task 4: Implement Docs Tab (API Endpoints, CodeBlock with cURL copy, Bot Commands, FAQ)

**Files:**
- Create: `web/src/components/docs/CodeBlock.tsx`
- Create: `web/src/components/docs/EndpointCard.tsx`
- Create: `web/src/components/docs/BotCommands.tsx`
- Create: `web/src/components/docs/FaqSection.tsx`
- Create: `web/src/components/docs/WhatsAppBanner.tsx`
- Create: `web/src/components/docs/DocsTab.tsx`

**Interfaces:**
- Produces: `DocsTab` component featuring documentation for `/api/am/send-link`, `/api/am/verify`, `/api/am/preset/find`, and `/api/am/command`.

- [ ] **Step 1: Implement `CodeBlock.tsx` with dark syntax block and one-click "Salin cURL" button with toast notification**
- [ ] **Step 2: Implement `EndpointCard.tsx` rendering HTTP badge, endpoint path, description, request payload, and success response**
- [ ] **Step 3: Implement `BotCommands.tsx` showing example commands (`!amprem`, `!ampreset`, `!amstats`, `!amhelp`)**
- [ ] **Step 4: Implement `FaqSection.tsx` and `WhatsAppBanner.tsx`**
- [ ] **Step 5: Assemble `DocsTab.tsx` and integrate into `page.tsx`**
- [ ] **Step 6: Run build verification**

Run: `cd web && npm run build`
Expected: Compiled successfully.

- [ ] **Step 7: Commit docs tab**

```bash
git add web/src/components/docs/ web/src/app/
git commit -m "feat(web): implement docs tab with api endpoints, copy curl, faq, and bot commands"
```

---

### Task 5: Implement Interactive Playground Tab

**Files:**
- Create: `web/src/components/playground/SendLinkForm.tsx`
- Create: `web/src/components/playground/VerifyLinkForm.tsx`
- Create: `web/src/components/playground/PresetFinderForm.tsx`
- Create: `web/src/components/playground/PlaygroundTab.tsx`

**Interfaces:**
- Consumes: `apiClient.sendLink()`, `apiClient.verifyLink()`, `apiClient.findPreset()` from `src/lib/api.ts`
- Produces: `PlaygroundTab` allowing real-time testing of all 3 endpoints with live JSON output formatting.

- [ ] **Step 1: Implement `SendLinkForm.tsx` with email input, submit button with spinner, and formatted JSON output**
- [ ] **Step 2: Implement `VerifyLinkForm.tsx` with email input, link/oobCode textarea, quick sample filler, and activation output**
- [ ] **Step 3: Implement `PresetFinderForm.tsx` with TikTok/YouTube URL textarea, sample URL filler, and extracted links / join sl output**
- [ ] **Step 4: Assemble `PlaygroundTab.tsx` with sub-navigation switcher and integrate into `page.tsx`**
- [ ] **Step 5: Verify build**

Run: `cd web && npm run build`
Expected: Compiled successfully.

- [ ] **Step 6: Commit playground tab**

```bash
git add web/src/components/playground/ web/src/app/
git commit -m "feat(web): implement interactive playground tester forms"
```

---

### Task 6: Implement TikTok-style Comment Drawer & Threaded Comments System

**Files:**
- Create: `web/src/components/comments/CommentItem.tsx`
- Create: `web/src/components/comments/CommentInput.tsx`
- Create: `web/src/components/comments/EmojiPicker.tsx`
- Create: `web/src/components/comments/CommentDrawer.tsx`
- Create: `web/src/components/comments/LogoLoader.tsx`

**Interfaces:**
- Consumes: `apiClient.getComments()`, `apiClient.postComment()` from `src/lib/api.ts`
- Produces: Sticky sidebar on desktop, slide-up sheet on mobile with floating action button (FAB), supporting nested replies, `[Anonim]` badge, pagination, and emoji picker.

- [ ] **Step 1: Implement `LogoLoader.tsx` with pulsing animated Alight Motion SVG logo**
- [ ] **Step 2: Implement `CommentItem.tsx` with user avatar, name, `[Anonim]` badge, timestamp, reply button, and nested replies**
- [ ] **Step 3: Implement `EmojiPicker.tsx` with 9 category tabs, search input, and quick emoji insertion**
- [ ] **Step 4: Implement `CommentInput.tsx` with author name, anonymous toggle, reply indicator banner, auto-expanding textarea, emoji toggle, and submit button**
- [ ] **Step 5: Implement `CommentDrawer.tsx` with mobile FAB, desktop sticky drawer, pagination bar, and integrate into `page.tsx`**
- [ ] **Step 6: Verify build**

Run: `cd web && npm run build`
Expected: Compiled successfully.

- [ ] **Step 7: Commit comment system**

```bash
git add web/src/components/comments/ web/src/app/
git commit -m "feat(web): implement full tiktok-style comment drawer with threaded replies and emoji picker"
```

---

### Task 7: Root Package Scripts & End-to-End Integration Verification

**Files:**
- Create: `package.json` (root orchestrator)
- Create: `.gitignore` (root level)
- Modify: `README.md`

**Interfaces:**
- Produces: Root commands `npm run dev:api`, `npm run dev:web`, `npm run build:api`, `npm run build:web`, `npm test:api`.

- [ ] **Step 1: Create root `package.json` with helper scripts for both sub-projects**
- [ ] **Step 2: Update root `README.md` documenting the 2 sub-projects structure and getting started steps**
- [ ] **Step 3: Run backend test suite from root (`npm run test:api` or `cd api && npm test`)**
- [ ] **Step 4: Run backend build (`npm run build:api`)**
- [ ] **Step 5: Run frontend build (`npm run build:web`)**
- [ ] **Step 6: Commit root setup and documentation**

```bash
git add package.json README.md .gitignore
git commit -m "chore: add root npm scripts and verify end-to-end integration"
```
