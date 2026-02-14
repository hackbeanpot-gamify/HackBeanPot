# 🎮 QuestBoard

> We turn community issues into daily quests and volunteering into a multiplayer game.

QuestBoard gamifies community service by connecting local people, helping organizations find volunteers, and empowering individuals to make real impact through fun, rewarding daily challenges that build lasting habits.

---

## 🚀 Goals

- **Connect** local communities and increase civic engagement
- **Help** nonprofits and organizations find reliable volunteers
- **Empower** individuals to create real impact through everyday actions
- **Improve** communities by making volunteering more accessible and consistent

## 💡 How It Works

- **Daily Micro-Tasks** — The app assigns users bite-sized tasks based on common community problems and reported concerns, building long-term positive habits (think Duolingo, but for doing good).
- **Community Report Board** — Users can submit local issues (dirty streets, areas needing group cleanup, etc.) that influence future tasks and quests.
- **Streaks, XP & Levels** — Track your progression through XP, levels, and streaks to reward consistency and keep you motivated.
- **City-Wide Leaderboard** — Compete with your community! Users are ranked based on XP and completed tasks.
- **"Raid Boss" Events** — Larger community events (beach cleanups, park restorations, etc.) that bring people together for high-impact group action.

## 🎯 Three Big Points

1. **Connect** individuals in the same community together
2. **Allow organizations** to find people willing to volunteer
3. **Allow people** to individually do good for their community

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (React), TypeScript, ShadCN UI, Tailwind CSS, Lucide React (icons) |
| **Backend / Database** | Supabase (PostgreSQL + APIs) — `@supabase/supabase-js` |
| **Authentication** | Supabase Auth / OAuth (Google login) — `@supabase/ssr` |
| **AI / NLP** | Gemini API — `@google/generative-ai` (LLM processing for community concerns + sentiment analysis) |
| **UI Utilities** | `class-variance-authority`, `clsx`, `tailwind-merge` (required by ShadCN UI) |
| **Deployment** | Vercel (primary), AWS (optional / secondary) |
| **Testing / Dev Tools** | Thunder Client, Docker (optional) |
| **Storage** | Supabase (main), Local Storage (light client-side persistence) |

---

## 👥 Team

| Name | Role |
|---|---|
| **Yash** | AI / Deployment / Strategy |
| **Rida** | UI/UX Design (Figma, branding, flows, slides) |
| **Seifer** | Database + Backend (Supabase schema, APIs, data display) |
| **Jackson** | Frontend + OAuth (Next.js, Auth integration, routing) |
| **Matt** | Fullstack (frontend + backend integration) |

---

## 📋 Core Features (MVP)

- [x] Daily micro-task assignment based on community problems and reported concerns
- [x] Community report board for submitting local issues
- [x] City-wide leaderboard ranked by XP and completed tasks
- [x] User progression tracking (XP, levels, streaks)

---

## 📁 Project Structure

```
hackbeanpot_app/
├── app/                          # Next.js App Router (pages + API routes)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page (/)
│   ├── dashboard/
│   │   └── page.tsx              # User dashboard — daily quests & progress overview
│   ├── quests/
│   │   └── page.tsx              # Browse & complete daily micro-tasks
│   ├── community/
│   │   └── page.tsx              # Community report board — submit & view local issues
│   ├── leaderboard/
│   │   └── page.tsx              # City-wide XP leaderboard
│   ├── profile/
│   │   └── page.tsx              # User profile — stats, streaks, achievements
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page (Google OAuth)
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   └── api/
│       ├── quests/
│       │   └── generate/
│       │       └── route.ts      # POST — AI-generated quests from community reports
│       ├── reports/
│       │   └── route.ts          # GET + POST — community reports CRUD
│       └── leaderboard/
│           └── route.ts          # GET — city-wide leaderboard data
│
├── components/                   # Reusable React components
│   ├── ui/                       # ShadCN UI primitives (button, card, input, etc.)
│   ├── layout/                   # Navbar, footer, sidebar
│   ├── quests/                   # Quest card, quest list
│   ├── community/                # Report card, report form
│   ├── leaderboard/              # Leaderboard table, rank badge
│   └── profile/                  # XP bar, streak counter, level badge
│
├── lib/                          # Shared utilities & client configs
│   ├── utils.ts                  # cn() helper for Tailwind class merging
│   ├── gemini.ts                 # Gemini AI client config
│   └── supabase/
│       ├── client.ts             # Supabase browser client
│       ├── server.ts             # Supabase server client (App Router)
│       └── middleware.ts         # Supabase session refresh helper
│
├── types/                        # TypeScript type definitions
│   └── index.ts                  # User, Quest, Report, LeaderboardEntry, RaidEvent
│
├── middleware.ts                  # Next.js middleware (auth session refresh)
├── .env.local.example             # Environment variable template
├── tailwind.config.ts             # Tailwind CSS config
├── tsconfig.json                  # TypeScript config
└── package.json
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm (comes with Node.js)

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd hackbeanpot_app

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.local.example .env.local
# Then fill in your Supabase URL, Anon Key, and Gemini API Key

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌐 Deployment

Deployed on [Vercel](https://vercel.com). See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

*Built with ❤️ at HackBeanpot*
