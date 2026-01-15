# Save the Dhaleshwari - Website Guide

A comprehensive guide for managing the "Save the Dhaleshwari" website.

---

## Website Features

### Public Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Main landing page with hero video, crisis stats, mission, stories, timeline, project lead, and volunteer form |
| Gallery | `/gallery` | Mosaic photo grid + video gallery from Supabase storage |
| FAQ | `/faq` | Frequently asked questions about the program |
| Thank You | `/thank-you` | Confirmation page after form submission |

### Key Components

- **Hero Section** - Full-screen video background with call-to-action
- **Crisis Stats** - Animated statistics about river pollution
- **Volunteer Form** - Application form that saves to Supabase database
- **Interactive Gallery** - Filterable images with lightbox + video embeds

---

## Admin Panel

### Accessing the Admin Panel

1. Navigate to: `https://your-domain.com/admin`
2. Enter your admin email and password
3. Click "Sign In"

### Dashboard Features

| Feature | Description |
|---------|-------------|
| **Statistics** | Total applications, this week, today |
| **Search** | Filter by name, email, or university |
| **View Details** | Click "View" to see full application |
| **Export to Excel** | Download all applications as `.xlsx` file |
| **Send Email** | Direct email link to applicants |

### Creating an Admin User

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project → **Authentication** → **Users**
3. Click **Add User**
4. Enter email and password
5. Make sure to set the email as verified
6. Save

---

## Supabase Dashboard

### Project Overview

Your Supabase project handles:
- **Authentication** - Admin login
- **Database** - Volunteer applications storage
- **Storage** - Video files for gallery

### Managing Volunteer Applications

Navigate to: **Table Editor** → `volunteer_applications`

| Column | Description |
|--------|-------------|
| `id` | Unique identifier |
| `name` | Applicant's full name |
| `email` | Contact email |
| `phone` | Phone number (optional) |
| `age` | Age (optional) |
| `university` | University/institution |
| `motivation` | Why they want to volunteer |
| `created_at` | Submission timestamp |

**To delete an application:**
1. Find the row in Table Editor
2. Click the row → Delete

### Managing Videos

Navigate to: **Storage** → `media` bucket

**To add a new video:**
1. Go to Storage → `media` bucket, then the `videos` folder
2. Click **Upload files**
3. Select your `.mp4` file
4. Update `app/actions/media.ts` with the new filename

**To replace a video:**
1. Delete the old file from the bucket
2. Upload the new file with the **same filename**

**To upload a new image:**
1. Go to Storage → `media` bucket, then the `images` folder
2. Click **Upload files**
3. Select your `.jpg` or `.png` file
4. Update `gallery/page.tsx` with the new filename entry

### Bucket Settings

The `media` bucket is set to **public**. This means images and videos are accessible without authentication via URLs like:
```
https://[project-id].supabase.co/storage/v1/object/public/media/[folder]/[filename]
```

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't log into admin | Check credentials in Supabase → Authentication → Users |
| Videos not loading | Verify filenames match exactly in `app/actions/media.ts` |
| Form not submitting | Check Supabase → Table Editor → `volunteer_applications` exists |
| Admin page redirects | Make sure you're logged in or cookies are enabled |

---

## Technical Support

For technical issues with the website code, give me a treat and I'll help you out :)
