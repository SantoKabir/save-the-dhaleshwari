# Dhaleshwari River Pollution Awareness — Website

A research-driven Next.js platform for the **Dhaleshwari River Pollution Awareness (DRPA)** initiative — a student-led project documenting industrial pollution and public health impacts along the Dhaleshwari River in Bangladesh.

---

## Website Features

### Public Pages

| Page         | URL              | Description                                                                                                              |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Home         | `/`              | Hero, partners bar, mission pillars, key findings with animated counters, research timeline, highlighted events carousel |
| Events       | `/events`        | Announcements carousel + animated SVG river-path timeline of all research events                                         |
| Event Detail | `/events/[slug]` | Rich MDX content with embedded Chart.js charts, statistics, LaTeX equations, media gallery                               |
| Team         | `/team`          | Team leader highlight + member grid with status badges                                                                   |
| FAQ          | `/faq`           | Admin-managed accordion FAQ                                                                                              |

### Key Features

- **Dark/Light mode** — Toggle via sun/moon button in header (powered by `next-themes`)
- **MDX event content** — Rich Markdown with custom components: `<StatCard>`, `<ChartEmbed>`, `<ImageGallery>`, `<VideoEmbed>`, `<DataTable>`
- **Animated SVG timeline** — River-inspired scroll-tracing path on the events page (Framer Motion)
- **LaTeX math** — Rendered via `remark-math` + `rehype-katex`

---

## Admin Panel

### Accessing the Admin Panel

1. Navigate to: `https://your-domain.com/admin`
2. Enter your admin email and password
3. Click "Sign In"

### Dashboard Tabs

| Tab               | Description                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| **Team Members**  | Add/edit/delete members, toggle public visibility, set leader, reorder, upload photos                     |
| **FAQ**           | Add/edit/delete questions, toggle published, reorder                                                      |
| **Events**        | Add/edit/delete events, MDX content editor with preview, cover image upload, toggle published/highlighted |
| **Event Media**   | Upload/manage images and videos per event (stored in Supabase Storage)                                    |
| **Announcements** | Add/edit/delete time-bound announcements with display dates                                               |

### Features

- **Search & filter** across all content types
- **Excel export** for team and event data (ExcelJS)
- **Image upload** to Supabase Storage with real-time preview

### Creating an Admin User

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project → **Authentication** → **Users**
3. Click **Add User**
4. Enter email and password
5. Set the email as verified
6. Save

---

## Supabase Dashboard

### Account

Log in to Supabase with your **GitHub** account to see your project.

### What Supabase Handles

Supabase is used **only** for:

- **Authentication** — Admin login via email/password
- **Storage** — Media files in the `media` bucket (images and videos folders)

All data (team, FAQ, events, announcements) is managed through **Prisma ORM** connected to the Supabase PostgreSQL database.

### Managing Media

Navigate to: **Storage** → `media` bucket

**To upload images/videos:**

1. Go to Storage → `media` bucket → `images` or `videos` folder
2. Click **Upload files**
3. Select your files
4. Use the admin panel Event Media tab to associate media with events

### Bucket Settings

The `media` bucket is set to **public**. Files are accessible via:

```
https://[project-id].supabase.co/storage/v1/object/public/media/[folder]/[filename]
```

---

## Database Schema (Prisma)

| Model          | Table           | Key Fields                                                                                                                         |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `TeamMember`   | `team_members`  | name, bio, email, phone, picture_url, is_leader, is_public, status (ACTIVE/FORMER), sort_order                                     |
| `FaqItem`      | `faq_items`     | question, answer, sort_order, is_published                                                                                         |
| `Event`        | `events`        | title, slug (unique), summary, description (MDX), cover_image_url, event_date, location, is_highlighted, is_published, tags (JSON) |
| `EventMedia`   | `event_media`   | event_id (FK), media_url, media_type (IMAGE/VIDEO/CHART), caption, sort_order                                                      |
| `Announcement` | `announcements` | title, content, image_url, link_url, is_active, display_from, display_until, sort_order                                            |

---

## Development

### Setup

```bash
npm install
cp .env.example .env.local   # Configure DATABASE_URL and Supabase keys
npx prisma generate           # Generate Prisma Client
npx prisma db push            # Create tables
npx prisma db seed            # Seed initial data
npm run dev                   # Start dev server
```

### Commands

```bash
npm run dev      # Start development server
npm run build    # Generate Prisma Client + build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

This website is deployed with [Vercel](https://vercel.com). Sign in to Vercel with your GitHub account to see the details.

### Environment Variables (Vercel)

| Variable                        | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`                  | Supabase PostgreSQL connection string (use Session Pooler URL) |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                                         |

---

## Quick Troubleshooting

| Issue                   | Solution                                                                        |
| ----------------------- | ------------------------------------------------------------------------------- |
| Can't log into admin    | Check credentials in Supabase → Authentication → Users                          |
| Events not loading      | Verify `DATABASE_URL` is correct and accessible                                 |
| Charts not rendering    | Check MDX syntax — `labels` and `datasets` props must use JSX expression syntax |
| Images not loading      | Verify Supabase Storage bucket is public and domain is in `next.config.ts`      |
| Admin page redirects    | Make sure you're logged in or cookies are enabled                               |
| Prisma connection error | Use Session Pooler URL (not direct connection) for non-IPv6 environments        |

---

## Technical Support

For technical issues with the website code, give me a treat and I'll help you out :)
