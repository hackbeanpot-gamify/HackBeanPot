# 🎪 Impact Trail

> We turn community issues into daily quests and volunteering into a multiplayer game.

**Impact Trail** gamifies community service with an immersive arcade/carnival experience. Connect local people, help organizations find volunteers, and empower individuals to make real impact through fun, rewarding daily challenges that build lasting habits.

---

## 🚀 Mission

- **Connect** local communities and increase civic engagement
- **Help** nonprofits and organizations find reliable volunteers
- **Empower** individuals to create real impact through everyday actions
- **Improve** communities by making volunteering more accessible and consistent

## 💡 How It Works

- **Daily Micro-Tasks** — Bite-sized quests based on community problems and reported concerns, building long-term positive habits (think Duolingo, but for doing good).
- **AI-Powered Quest Generation** — Community reports are analyzed by Gemini AI to match existing quests or create new ones automatically.
- **Community Report Board** — Submit local issues (dirty streets, areas needing cleanup, etc.) that influence future tasks and quests.
- **Streaks, XP & Levels** — Track progression through XP, levels, and streaks to reward consistency and stay motivated.
- **City-Wide Leaderboard** — Compete with your community! Users ranked by total XP and completed tasks.
- **"Raid Boss" Events** — Larger community events (beach cleanups, park restorations) that bring people together for high-impact group action with RSVP system.
- **Arcade Theme** — Immersive retro gaming aesthetic with tents, consoles, and carnival-style UI throughout.

## 🎯 Three Big Points

1. **Connect** individuals in the same community together
2. **Allow organizations** to find people willing to volunteer
3. **Allow people** to individually do good for their community

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | Next.js 16.1.6 (App Router, Turbopack), React 19.2.3, TypeScript 5 |
| **UI/Styling** | Tailwind CSS 4, ShadCN UI, Lucide React (icons) |
| **Fonts** | Google Fonts (Fredoka for headings, Nunito for body) |
| **Animations** | Framer Motion 12.34 |
| **Backend / Database** | Supabase (PostgreSQL) — `@supabase/supabase-js` v2.95.3 |
| **Authentication** | Supabase Auth + SSR (`@supabase/ssr`) — *OAuth ready, demo mode active* |
| **AI / NLP** | Google Gemini 2.0 Flash API — `@google/generative-ai` (quest generation from reports, temperature: 0.4) |
| **Email** | Resend v6.9.2 (quest reminders & confirmations) |
| **SMS Notifications** | Twilio — `twilio` (configured, minimal integration) |
| **Security** | bcryptjs (password hashing) |
| **UI Utilities** | `class-variance-authority`, `clsx`, `tailwind-merge` |
| **Deployment** | Vercel (primary) |
| **Dev Tools** | ESLint 9, tsx (TypeScript execution) |

---

## 🗄️ Database Schema

### Core Tables

**profiles** (user accounts)

- `id`, `email`, `display_name`, `avatar_url`
- `timezone`, `city`
- `saves_left`, `saves_month`, `saves_monthly_quota`

**user_stats** (progression tracking)

- `user_id` → FK to profiles
- `xp_total` (primary leaderboard ranking metric)
- `level` (calculated from XP)
- `streak_current`, `streak_best`
- `quests_completed_total`, `raid_boss_events_completed`
- `last_quest_completed_at`

**dailyQuest** (quest templates)

- `id`, `title`, `description`, `category`
- `xp_reward`, `estimated_minutes`
- `proof_type` (photo, checkbox, reflection)
- `is_daily`, `active`, `weight` (assignment priority)

**dailyQuestAssignment** (user assignments)

- `id`, `user_id`, `quest_id`, `assigned_date`
- `status`: "assigned" | "completed" | "expired"
- `proof_payload` (jsonb)
- `completed_at`, `emailed_at`

**raidBossEvent** (group volunteering events)

- `id`, `org_id`, `title`, `description`
- `location_text`, `start_time`, `end_time`
- `capacity`, `xp_reward`, `status`

**raidBossRsvp** (event attendance)

- `event_id`, `user_id`, `status`
- `checked_in_at`, `created_at`

**organization** (nonprofit partners)

- `id`, `name`, `contact_email`, `website`
- `verified`, `created_at`

### Quest Categories

`cleanup`, `volunteer`, `kindness`, `environment`, `community`, `social`, `civic`

### XP Rewards

- Easy: 75 XP
- Medium: 200 XP
- Hard: 400 XP
- Raid Boss: Varies (set per event)

---

## 📱 Pages & Routes

### Public Pages

- **`/landing`** — Hero section, carousel carts, leaderboard console preview, CTAs
- **`/auth/login`** — Unified signup/login form *(demo mode: redirects to /profile)*
- **`/reports`** — "Complaint Terminal" arcade console for submitting community issues
- **`/partners`** — Organization benefits showcase
- **`/about`** — About page

### Protected Pages (Arcade Theme)

- **`/dashboard`** — Main hub with carousel of 4 tents:
  1. **Profile Tent** — Username, XP, streak, level
  2. **Leaderboard Tent** — Top 5 users in mini arcade console
  3. **Quests Tent** — Today's daily quest + RSVP'd raid events
  4. **Boss Quests Tent** — Available raid boss events with RSVP buttons

- **`/profile`** — Detailed user profile with XP progress, stats, and arcade console UI
- **`/daily/confirmed`** — Quest confirmation page (shows XP earned, new level, streak)

---

## 🔌 API Endpoints

### Quest & User Data

- **`GET /api/leaderboard`** — Top 50 users ranked by total XP (joins user_stats + profiles)
- **`GET /api/dailyQuest/page`** — Today's assigned quest + user's RSVP'd events
- **`GET /api/raidBoss/all`** — All raid boss events
- **`POST /api/raidBoss/rsvp`** — RSVP to a raid boss event (body: `{ eventId }`)

### AI-Powered Quest Generation

- **`POST /api/reports`** — Submit complaint → Gemini AI analyzes → creates/bumps quest weight
  - Uses existing quests list as context
  - Returns action taken: "matched" or "created"
  - Complaints NOT stored (privacy-first)

### Cron Jobs (requires `x-cron-secret` header)

- **`POST /api/cron/assign-daily-quests`** — Daily quest assignment + email job
- **`POST /api/cron/email-daily-quests`** — Send email reminders to users

### Admin/Dev

- **`POST /api/seed-login`** — Demo seeding endpoint
- **`GET /api/test-db`** — Database connectivity test

### Notifications

- **`POST /api/notifications`** — Generic notification sender
- **`POST /api/notifications/daily-quest`** — Quest reminder notifications

---

## 📋 Core Features

### ✅ Fully Implemented

- [x] Landing page with leaderboard preview & arcade theme
- [x] Dashboard carousel UI with 4 tents (Profile, Leaderboard, Quests, Boss Quests)
- [x] Community report submission via "Complaint Terminal"
- [x] AI-powered quest generation (Gemini analyzes reports → matches/creates quests)
- [x] City-wide leaderboard ranked by total XP (top 50)
- [x] Raid boss event browsing & RSVP system
- [x] User profile display with XP, level, streak tracking
- [x] Email notification infrastructure (Resend)
- [x] Arcade/carnival UI theme throughout (tents, consoles, retro styling)

### ⚠️ Partially Implemented

- [ ] Daily quest assignment automation (cron infrastructure ready, needs scheduling)
- [ ] Quest completion flow (API exists, UI in progress)
- [ ] Email confirmation links (template ready, flow incomplete)
- [ ] User authentication (forms exist, OAuth configured, **currently in demo mode**)

### 🚧 Planned Features

- [ ] Multi-user session support (currently hardcoded to demo user)
- [ ] Quest proof submission UI (photo/reflection upload)
- [ ] Raid boss check-in verification
- [ ] SMS notifications via Twilio
- [ ] Organization admin panel for event management
- [ ] Automated quest scheduling & rotation
- [ ] Achievement badges & rewards
- [ ] Mobile app (PWA or native)

---

## 👥 Team

| Name | Role |
| --- | --- |
| **Yash** | AI / Deployment / Strategy |
| **Rida** | UI/UX Design (Figma, branding, flows, slides) |
| **Seifer** | Database + Backend (Supabase schema, APIs, data display) |
| **Jackson** | Frontend + OAuth (Next.js, Auth integration, routing) |
| **Matt** | Fullstack (frontend + backend integration) |

---

## 📁 Project Structure

```text
impact-trail/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Root → redirects to /landing
│   │
│   ├── landing/
│   │   └── page.tsx              # Landing page (hero, carts, leaderboard, CTAs)
│   ├── dashboard/
│   │   └── page.tsx              # Main carousel hub (4 tents)
│   ├── profile/
│   │   └── page.tsx              # User profile & stats
│   ├── reports/
│   │   └── page.tsx              # Community report form (Complaint Terminal)
│   ├── partners/
│   │   └── page.tsx              # Organization benefits page
│   ├── about/
│   │   └── page.tsx              # About page
│   ├── daily/
│   │   └── confirmed/
│   │       └── page.tsx          # Quest confirmation page (email link destination)
│   │
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Unified signup/login form
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   │
│   └── api/
│       ├── leaderboard/
│       │   └── route.ts          # GET — Top 50 users by XP
│       ├── reports/
│       │   └── route.ts          # POST — Submit complaint → Gemini AI → quest
│       ├── dailyQuest/
│       │   └── page/
│       │       └── route.ts      # GET — Today's quest + RSVP events
│       ├── raidBoss/
│       │   ├── all/
│       │   │   └── route.ts      # GET — All raid boss events
│       │   └── rsvp/
│       │       └── route.ts      # POST — RSVP to event
│       ├── cron/
│       │   ├── assign-daily-quests/
│       │   │   └── route.ts      # POST — Daily assignment job
│       │   └── email-daily-quests/
│       │       └── route.ts      # POST — Email reminder job
│       ├── notifications/
│       │   ├── route.ts          # POST — Generic notifications
│       │   └── daily-quest/
│       │       └── route.ts      # POST — Quest reminders
│       ├── test-db/
│       │   └── route.ts          # GET — Database connection test
│       └── seed-login/
│           └── route.ts          # POST — Demo seeding
│
├── components/                   # Reusable React components
│   ├── ArcadeNavbar.tsx          # Fixed navbar with arcade theme
│   └── about/                    # Landing page components
│       ├── ConfettiDots.tsx      # Background confetti effect
│       ├── ScrollReveal.tsx      # Scroll-triggered animations
│       ├── HeroBadge.tsx         # "Now in beta" badge
│       ├── Cart.tsx              # Feature showcase carts
│       ├── LeaderboardConsole.tsx # Arcade-style leaderboard display
│       └── ...                   # Other landing components
│
├── lib/                          # Utilities & business logic
│   ├── hooks/                    # Custom React hooks
│   │   ├── useLeaderboard.ts     # Fetch top 50 users
│   │   ├── useDailyQuestPage.ts  # Today's quest + events
│   │   ├── useRaidBossEvents.ts  # All raid boss events
│   │   └── useReports.ts         # Submit complaints
│   │
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server-side client
│   │   ├── adminClient.ts        # Admin client (service role)
│   │   └── middleware.ts         # Session refresh (ready, not active)
│   │
│   ├── raidBoss/
│   │   ├── getAllRaidBossEvents.ts
│   │   ├── createRsvp.ts
│   │   ├── getUserRsvps.ts
│   │   └── getDailyQuestWithRsvps.ts
│   │
│   ├── quests/
│   │   └── assignDailyQuestToUser.ts
│   │
│   ├── assignments/
│   │   ├── createAssignment.ts
│   │   ├── markAssignmentEmailed.ts
│   │   └── getAssignment.ts
│   │
│   ├── jobs/
│   │   └── assignDailyQuestsJob.ts
│   │
│   ├── email/
│   │   └── resendClient.ts       # Resend email setup
│   │
│   ├── ai/
│   │   └── gemini.ts             # Gemini AI config
│   │
│   └── utils.ts                  # Tailwind cn() helper
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│                                 # (User, DailyQuest, RaidBossEvent, etc.)
│
├── email/                        # Email templates (HTML/text)
│   └── daily-quest-template.html
│
├── supabase/                     # Supabase project config
│   └── types.ts                  # Auto-generated DB types
│
├── middleware.ts                 # Next.js middleware (session refresh ready)
├── .env.local.example            # Environment variable template
├── tailwind.config.ts            # Tailwind 4 config
├── tsconfig.json                 # TypeScript strict mode
├── next.config.ts                # Next.js config
└── package.json
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js 18+** installed
- **npm** (comes with Node.js)
- **Supabase account** (free tier works)
- **Google Gemini API key** (for AI quest generation)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd hackbeanpot_app

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.local.example .env.local
```

**Edit `.env.local` with your credentials:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
RESEND_API_KEY=your-resend-api-key (optional)
TWILIO_ACCOUNT_SID=your-twilio-sid (optional)
TWILIO_AUTH_TOKEN=your-twilio-token (optional)
```

```bash
# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Deployment

**Recommended:** Deploy on [Vercel](https://vercel.com) (zero-config Next.js hosting)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

**Cron Jobs:** Set up Vercel Cron to hit `/api/cron/assign-daily-quests` daily at 6 AM ET.

See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other platforms.

---

## 🔑 Key Integrations

### Google Gemini AI (Quest Generation)

When a user submits a community report via `/reports`:

1. Report text + existing quest list sent to Gemini 2.0 Flash
2. Gemini analyzes complaint and decides:
   - **Match existing quest** → Bump its `weight` (assignment priority)
   - **Create new quest** → Generate title, description, category, XP, etc.
3. Response returned to user showing what action was taken
4. Complaint text is NOT stored (privacy-first design)

**Model Settings:**

- Temperature: 0.4 (balanced creativity + consistency)
- Response format: JSON
- System role: Quest generator specialist

### Supabase Database

**Row Level Security (RLS):** Configured on all tables

- Public read on `profiles`, `user_stats`, `dailyQuest`, `raidBossEvent`
- Restricted writes require auth or service role
- Service role used for cron jobs and admin operations

**Realtime Subscriptions:** Available but not yet implemented in UI

### Email Notifications (Resend)

Daily quest assignments trigger emails with:

- Quest title, description, estimated time
- XP reward and category
- One-click confirmation link
- Personalized greeting with username

**Template:** `email/daily-quest-template.html`

---

## 🎨 UI Design Philosophy

**Arcade/Carnival Theme:**

- Retro gaming aesthetic with modern polish
- Tent-based navigation on dashboard
- Console-style panels with scanlines & LED indicators
- Power buttons, D-pads, and coin slots as decorative elements
- Warm color palette: amber, red, blue accents
- Google Fonts: Fredoka (playful headings), Nunito (clean body)

**Responsive Design:**

- Mobile-first approach
- Carousel navigation for multi-section layouts
- Touch-friendly buttons and controls
- Optimized for 320px+ viewports

---

## 🐛 Known Issues & Limitations

1. **Authentication:** Demo mode only (hardcoded user)
2. **Quest Completion UI:** API ready, frontend in progress
3. **Proof Submission:** Database schema ready, upload UI not built
4. **Cron Scheduling:** Endpoints exist, need Vercel Cron setup
5. **SMS Notifications:** Twilio configured but minimal integration
6. **Raid Boss Check-In:** RSVP works, attendance verification incomplete
7. **Admin Panel:** No UI for organizations to manage events
8. **Multi-User:** App works for single demo user, session management needed

---

## 📊 Leaderboard Mechanics

**Ranking Formula:** Total XP only (no soft cap)

**Level Calculation:**
```typescript
xpForLevel(level) = 250 * level * (level - 1)
```

**Public Stats Shown:**

- Display name
- Total XP
- Current level
- Current streak
- Total quests completed

**Private Stats (Hidden):**

- Email address
- Timezone
- City
- Saves remaining
- Last quest completion timestamp

---

## 🤝 Contributing

This is a HackBeanpot project built by a team of 5 developers. For collaboration:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

**Coding Standards:**

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (if configured)
- Use ShadCN UI components for consistency

---

## 📄 License

[Specify your license here]

---

## 🎉 Acknowledgments

- **HackBeanpot** for the opportunity
- **Supabase** for the backend infrastructure
- **Google Gemini** for AI-powered quest generation
- **Vercel** for hosting and deployment
- **ShadCN UI** for component primitives

---

*Built with ❤️ at HackBeanpot 2025*
