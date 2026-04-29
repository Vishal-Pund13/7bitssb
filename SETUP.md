# SSB Research Journal — Setup Guide

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the contents of `src/lib/supabase/schema.sql`
   - This creates all tables, RLS policies, storage bucket, and seeds the first article
3. Copy your project URL and anon key from **Settings → API**
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

## 2. Admin User Setup

1. In Supabase Dashboard → **Authentication → Users**
2. Click "Invite user" and add your admin email
3. Or use "Add user" with email + password
4. Only this email can access `/admin`

## 3. Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 4. Deploy to Vercel

1. Push to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel domain, e.g. `https://ssb-journal.vercel.app`)
4. Deploy!

## 5. Site Structure

```
/                    Home page (article feed + sidebar)
/articles            All articles grid
/articles/[slug]     Individual article (paper feel layout)
/glossary            Searchable key terms glossary
/gd-bank             GD topic bank with accordion
/about               About page
/admin               Protected admin dashboard (requires login)
/admin/login         Admin login
/admin/articles/new  Create article (TipTap editor)
/admin/articles/[id]/edit  Edit article
/admin/key-terms     Manage key terms
/admin/gd-topics     Manage GD topics
```

## 6. Design System

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#1a2a4a` | Primary / Nav |
| Crimson | `#c0392b` | Geopolitics |
| Forest | `#1e6b3c` | Economy |
| Steel Blue | `#185fa5` | Defence |
| Gold | `#b7950b` | Featured / India Angle |
| Paper | `#fdf9f0` | Article backgrounds |

Fonts: **Lora** (serif body), **Inter** (UI), **Crimson Pro** (display)

## 7. Adding New Articles

1. Go to `/admin/login`
2. Sign in with your admin credentials
3. Click **New Article**
4. Fill in: title, categories, source, India angle, body (TipTap editor)
5. Toggle "Published" to make it live
6. Use the Key Terms tab to add/link terminology
