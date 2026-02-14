"use client";

import { Fredoka, Nunito } from "next/font/google";
import NextLink from "next/link";
import {
  Sparkles,
  Target,
  Camera,
  Trophy,
  MapPin,
  Users,
  Flame,
  Swords,
  ChevronRight,
  Ticket,
  PartyPopper,
  Heart,
  TreePine,
  Trash2,
  Clock,
  Flag,
  Gamepad2,
  Globe,
  Link,
} from "lucide-react";

/* ─── components ─── */
import ConfettiDots from "@/components/about/ConfettiDots";
import RollercoasterTrack from "@/components/about/RollercoasterTrack";
import JourneyCard from "@/components/about/JourneyCard";
import TicketCard from "@/components/about/TicketCard";
import StatCard from "@/components/about/StatCard";
import StepCard from "@/components/about/StepCard";
import TestimonialCard from "@/components/about/TestimonialCard";
import PhotoCard from "@/components/about/PhotoCard";
import CarnivalFeatureCard from "@/components/about/CarnivalFeatureCard";
import CarnivalBanner from "@/components/about/CarnivalBanner";
import HeroBadge from "@/components/about/HeroBadge";
import QuestCardDemo from "@/components/about/QuestCardDemo";
import LeaderboardPreview from "@/components/about/LeaderboardPreview";
import XpBar from "@/components/about/XpBar";
import StreakCounter from "@/components/about/StreakCounter";
import AchievementBadges from "@/components/about/AchievementBadges";
import ScrollReveal from "@/components/about/ScrollReveal";

/* ═══════════════════════════════════════════════════════════
   FONTS — Fredoka for headings (playful, not childish),
   Nunito for body (clean, very readable on dark bg).
   ═══════════════════════════════════════════════════════════ */
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
});

/** Heading font shorthand */
const hFont = { fontFamily: "var(--font-fredoka)" } as const;

/* ═══════════════════════════════════════════════════════════
   STATIC DATA
   
   EMPTY DATA RULE: Every rendering loop checks for empty
   arrays / blank strings before rendering. Components also
   have internal guards.
   ═══════════════════════════════════════════════════════════ */

const stats = [
  { icon: Target, label: "Quests Completed", value: "12,847", accent: "bg-amber-400/15 text-amber-400" },
  { icon: Trash2, label: "Lbs Trash Collected", value: "6,320", accent: "bg-red-400/15 text-red-400" },
  { icon: Clock, label: "Volunteer Hours", value: "34,500+", accent: "bg-orange-400/15 text-orange-400" },
  { icon: MapPin, label: "Neighborhoods Helped", value: "73", accent: "bg-yellow-400/15 text-yellow-400" },
  { icon: Users, label: "Active Questers", value: "4,210", accent: "bg-amber-400/15 text-amber-400" },
  { icon: TreePine, label: "Trees Planted", value: "1,085", accent: "bg-orange-400/15 text-orange-400" },
];

const steps = [
  { num: "1", title: "Report an Issue", desc: "Spot a dirty street, broken bench, or area needing cleanup? Drop a pin and describe the problem.", icon: Flag, color: "bg-amber-400" },
  { num: "2", title: "Quests Generated", desc: "Reports become bite-sized daily micro-tasks — like Duolingo for doing good — that anyone can pick up.", icon: Sparkles, color: "bg-orange-400" },
  { num: "3", title: "Complete & Prove", desc: "Head out, complete the quest, snap a photo as proof. Build bonds with neighbors along the way.", icon: Camera, color: "bg-red-400" },
  { num: "4", title: "Earn XP & Rise", desc: "Gain XP, extend your streak, climb the city-wide leaderboard. Every action levels up your community.", icon: Trophy, color: "bg-yellow-400" },
];

const photos = [
  { src: "/images/beach-cleanup.jpg", alt: "Beach cleanup quest in action", caption: "Quest #4,012 — Revere Beach cleanup, 48 volunteers strong 🏖️" },
  { src: "/images/boston-community.jpg", alt: "Community gathering in Boston", caption: "Raid Boss event in Dorchester — neighbors united 💛" },
];

const teamQuotes = [
  { name: "Jackson", handle: "@jackson", avatar: "🎮", quote: "Building this taught me that the best tech solves real problems — and makes it fun to care about your neighborhood.", rating: 5 },
  { name: "Yash", handle: "@yash", avatar: "🚀", quote: "We wanted something that actually sticks. The streak system keeps people coming back — even our testers got hooked.", rating: 5 },
  { name: "Sipher", handle: "@sipher", avatar: "⚡", quote: "The quest engine was the hardest part to build and the most rewarding. Watching reports turn into real impact is wild.", rating: 5 },
  { name: "Rida", handle: "@rida", avatar: "🎨", quote: "I wanted the design to feel like a game you want to open every day — not another boring volunteer app.", rating: 5 },
  { name: "Matt", handle: "@matt", avatar: "🛠️", quote: "The leaderboard changed everything. Once people could compete, volunteer sign-ups tripled overnight.", rating: 5 },
];

/* ── Carnival-styled feature cards ──
   Each card gets a unique carnival identity:
   - label: a tiny "booth sign" pill ("PRIZE BOOTH", etc.)
   - warm orange/red/yellow accent colors (NO neon, NO cyberpunk)
   - colors chosen from the carnival palette: #F6C453, #FF8A3D, #E84B5C, #FF7A1A */
const carnivalFeatures = [
  {
    icon: Target,
    title: "Daily Quests",
    desc: "Bite-sized tasks from real community reports — pick one up on your commute, lunch break, or weekend walk.",
    label: "PRIZE BOOTH",
    accentColor: "text-amber-400",
    accentBg: "bg-amber-400/15",
    accentRing: "ring-amber-400/50",
    borderColor: "border-amber-400/40",
    bulbColor: "bg-amber-300",
    labelBg: "bg-amber-400",
    labelText: "text-slate-900",
  },
  {
    icon: Flag,
    title: "Report Board",
    desc: "Anyone can flag an issue — litter, broken benches, overgrown lots. Reports feed the quest engine.",
    label: "NOTICE BOARD",
    accentColor: "text-red-400",
    accentBg: "bg-red-400/15",
    accentRing: "ring-red-400/50",
    borderColor: "border-red-400/40",
    bulbColor: "bg-red-300",
    labelBg: "bg-red-400",
    labelText: "text-white",
  },
  {
    icon: Flame,
    title: "Streaks & XP",
    desc: "Keep your streak alive, level up, and compete with friends. Community impact never felt this rewarding.",
    label: "HIGH SCORE",
    accentColor: "text-yellow-400",
    accentBg: "bg-yellow-400/15",
    accentRing: "ring-yellow-400/50",
    borderColor: "border-yellow-400/40",
    bulbColor: "bg-yellow-300",
    labelBg: "bg-yellow-400",
    labelText: "text-slate-900",
  },
  {
    icon: Swords,
    title: "Raid Boss Events",
    desc: "Large-scale challenges — park restorations, river cleanups — where the whole server teams up.",
    label: "MAIN EVENT",
    accentColor: "text-orange-400",
    accentBg: "bg-orange-400/15",
    accentRing: "ring-orange-400/50",
    borderColor: "border-orange-400/40",
    bulbColor: "bg-orange-300",
    labelBg: "bg-orange-400",
    labelText: "text-slate-900",
  },
];

/* ═══════════════════════════════════════════════════════════
   TRACK CHECKPOINT CONFIG
   
   Each checkpoint maps to a station on the rollercoaster SVG.
   The `y` values correspond to positions in the SVG viewBox
   (0 0 600 4800). The `side` tells JourneyCard which side of
   the track to render on (opposite to where the curve is).
   ═══════════════════════════════════════════════════════════ */
const trackCheckpoints = [
  { y: 400,  color: "#f59e0b", label: "The Big Top" },      // gold   — LEFT
  { y: 950,  color: "#e84b5c", label: "The Fun House" },     // red    — RIGHT
  { y: 1400, color: "#ff8a3d", label: "The Climb" },         // orange — LEFT
  { y: 1850, color: "#f6c453", label: "The Prize Booth" },   // yellow — RIGHT
  { y: 2350, color: "#f59e0b", label: "The Big Drop" },      // gold   — LEFT
  { y: 2900, color: "#e84b5c", label: "Postcards" },         // red    — RIGHT
  { y: 3450, color: "#ff8a3d", label: "Fellow Riders" },     // orange — RIGHT
  { y: 3900, color: "#f6c453", label: "Next Stops" },        // yellow — LEFT
];


/* ═══════════════════════════════════════════════════════════
   ABOUT PAGE
   
   ARCHITECTURE:
   ┌─────────────────────────────────┐
   │  HERO (z-20, own bg, no track) │
   ├─────────────────────────────────┤
   │  JOURNEY WRAPPER (relative)    │
   │  ┌───────────────────────────┐ │
   │  │ SVG TRACK (z-0, abs, ptr) │ │
   │  │ pointer-events-none       │ │
   │  └───────────────────────────┘ │
   │  ┌───────────────────────────┐ │
   │  │ CONTENT (z-10, relative)  │ │
   │  │ JourneyCards L/R          │ │
   │  └───────────────────────────┘ │
   ├─────────────────────────────────┤
   │  CTA (z-20, own bg, no track) │
   └─────────────────────────────────┘
   
   Z-INDEX STRATEGY:
   - Track SVG: z-0, pointer-events-none (never blocks clicks)
   - Content cards: z-10, relative (always clickable above track)
   - Hero/CTA: z-20, isolated sections (track never renders here)
   
   PALETTE (WARM CARNIVAL — NO CYBERPUNK / NO NEON):
   - Page bg: #0B1120 (deep midnight navy — carnival at dusk)
   - Card bg: #0f172a/90 (slightly lighter dark panel)
   - Warm gold: #f59e0b / amber-400 — primary accent, CTAs, borders
   - Orange: #ff8a3d / orange-400 — secondary accent, station 3/7
   - Red/pink: #e84b5c / red-400 — ticket accent, station 2/6
   - Yellow: #f6c453 / yellow-400 — highlights, station 4/8
   - Cream: #FFF2E0 — label pills on dark bg
   - Text: slate-50 (headings), slate-400 (body)
   ═══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <main
      className={`${fredoka.variable} ${nunito.variable} min-h-screen overflow-x-hidden`}
      style={{
        fontFamily: "var(--font-nunito)",
        backgroundColor: "#0B1120",
      }}
    >

      {/* ══════════════════════════════════════════════════
          HERO — "All Aboard!"
          
          ISOLATED: own z-20, own background gradient.
          The rollercoaster track does NOT render here.
          Nothing overlaps the hero content.
          ══════════════════════════════════════════════════ */}
      <section
        className="relative z-20 isolate px-4 pt-32 pb-28 text-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #080E1A 0%, #0B1120 60%, #0E1528 100%)",
        }}
      >
        {/* decorative carnival lights (very subtle) */}
        <ConfettiDots className="absolute inset-0" />

        {/* warm overhead glow — like string lights at a carnival entrance */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% -10%, rgba(245,158,11,0.07) 0%, transparent 55%)",
          }}
        />

        <ScrollReveal>
          <HeroBadge>
            <PartyPopper className="w-3.5 h-3.5 mr-1.5" /> Now in beta
          </HeroBadge>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p
            className="text-[11px] font-bold tracking-[0.35em] uppercase text-amber-400/40 mb-3"
            style={hFont}
          >
            🎪 All Aboard! 🎪
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none text-slate-50"
            style={hFont}
          >
            ____Quest
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <p className="mt-6 max-w-lg mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
            We turn community issues into{" "}
            <span className="font-semibold text-amber-300">daily quests</span>{" "}
            and volunteering into a{" "}
            <span className="font-semibold text-red-400">multiplayer game</span>.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.35}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <NextLink
              href="/dashboard"
              className="inline-flex items-center bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full px-7 py-2.5 text-sm font-bold shadow-lg shadow-amber-400/15 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              style={hFont}
            >
              Grab Your Ticket <ChevronRight className="w-4 h-4 ml-1" />
            </NextLink>
            <button
              className="inline-flex items-center border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-full px-7 py-2.5 text-sm font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              style={hFont}
            >
              <Flag className="w-3.5 h-3.5 mr-1.5" /> Report an Issue
            </button>
          </div>
        </ScrollReveal>

        {/* ticket divider — boarding pass feel */}
        <ScrollReveal delay={0.6}>
          <div className="mt-10 flex justify-center">
            <div
              className="inline-flex items-center gap-2 text-[10px] text-amber-400/25 tracking-[0.2em] uppercase select-none font-bold border-t border-b border-dashed border-slate-700/50 py-1.5 px-5"
              style={hFont}
            >
              <Ticket className="w-3.5 h-3.5" /> admit one quester{" "}
              <Ticket className="w-3.5 h-3.5 rotate-180" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* thin carnival stripe divider between hero and journey */}
      <CarnivalBanner />


      {/* ══════════════════════════════════════════════════
          JOURNEY WRAPPER
          
          This is where the rollercoaster track lives.
          The SVG track is absolutely positioned (z-0,
          pointer-events-none). Content cards sit above
          it at z-10 with position relative.
          
          The track SVG viewBox is 0 0 600 4800, and the
          wrapper height matches via aspect-ratio to keep
          checkpoint Y positions aligned with content.
          ══════════════════════════════════════════════════ */}
      <div
        className="relative w-full max-w-5xl mx-auto"
        style={{ minHeight: "4800px" }}
      >

        {/* ── ROLLERCOASTER TRACK SVG ──
            z-0 + pointer-events-none = never blocks content.
            The track curves L/R, and cards follow the curves. */}
        <RollercoasterTrack checkpoints={trackCheckpoints} />


        {/* ── CONTENT LAYER ──
            z-10 + relative = always above track, always clickable. */}
        <div className="relative z-10 px-4 sm:px-8">


          {/* ────────────────────────────────────────────
              STATION 1 — "The Big Top" (What We Do)
              
              Track curves LEFT here → card on LEFT side.
              Accent: warm gold (amber-400).
              This is the opening act — what the show is.
              ──────────────────────────────────────────── */}
          <div className="pt-32 pb-16 lg:w-[48%] lg:mr-auto">
            <JourneyCard
              side="left"
              station="Next Stop: The Big Top"
              stationEmoji="🎪"
              accentColor="text-amber-400"
              accentBorder="border-amber-400/25"
            >
              <h2 className="text-2xl font-bold text-slate-100 mb-2" style={hFont}>
                What We Do <Sparkles className="inline w-5 h-5 text-amber-400 ml-1" />
              </h2>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                We gamify community service — connecting Boston neighbors,
                helping orgs find volunteers, and empowering individuals to
                create real impact through everyday actions.
              </p>

              {/* ── GOALS — what we aim to achieve ── */}
              <div className="grid gap-3">
                {carnivalFeatures.filter((c) => c.title).map((item) => (
                  <CarnivalFeatureCard key={item.title} {...item} />
                ))}
              </div>
            </JourneyCard>
          </div>


          {/* ────────────────────────────────────────────
              STATION 2 — "The Fun House" (Try It)
              
              Track curves RIGHT → card on RIGHT side.
              Accent: ticket pink (pink-400).
              Interactive demo — click quests, see XP loop.
              ──────────────────────────────────────────── */}
          <div className="py-16 lg:w-[48%] lg:ml-auto">
            <JourneyCard
              side="right"
              station="Prize: XP + Streaks"
              stationEmoji="🎟️"
              accentColor="text-red-400"
              accentBorder="border-red-400/25"
            >
              <h2 className="text-2xl font-bold text-slate-100 mb-2" style={hFont}>
                Try It Yourself <Gamepad2 className="inline w-5 h-5 text-red-400 ml-1" />
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Click a quest card to see the loop — accept, prove, earn XP!
                Making doing good feel easy, fun, and motivating.
              </p>
              <div className="space-y-3">
                <QuestCardDemo />
                <XpBar level={12} currentXp={3_420} maxXp={5_000} title="Community Hero" />
                <StreakCounter streakDays={42} />
              </div>
            </JourneyCard>
          </div>


          {/* ────────────────────────────────────────────
              STATION 3 — "The Climb" (How It Works)
              
              Track curves LEFT → card on LEFT.
              Accent: muted indigo (indigo-400).
              Building momentum — the ride cranks upward.
              ──────────────────────────────────────────── */}
          <div className="py-16 lg:w-[48%] lg:mr-auto">
            <JourneyCard
              side="left"
              station="The Climb Begins"
              stationEmoji="🎢"
              accentColor="text-orange-400"
              accentBorder="border-orange-400/25"
            >
              <h2 className="text-2xl font-bold text-slate-100 mb-3" style={hFont}>
                How It Works
              </h2>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                Like Duolingo for doing good — small daily habits that compound
                into lasting community change. Report, quest, prove, level up.
              </p>
              {steps.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {steps.map((step) => (
                    <StepCard key={step.num} {...step} showConnector={false} />
                  ))}
                </div>
              )}
            </JourneyCard>
          </div>


          {/* ────────────────────────────────────────────
              STATION 4 — "The Prize Booth" (Compete)
              
              Track curves RIGHT → card on RIGHT.
              Accent: teal (teal-400).
              Peak of the ride — prizes and bragging rights.
              ──────────────────────────────────────────── */}
          <div className="py-16 lg:w-[48%] lg:ml-auto">
            <JourneyCard
              side="right"
              station="The Prize Booth"
              stationEmoji="🏆"
              accentColor="text-yellow-400"
              accentBorder="border-yellow-400/25"
            >
              <h2 className="text-2xl font-bold text-slate-100 mb-2" style={hFont}>
                Compete &amp; Collect
              </h2>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Climb the leaderboard, unlock badges, become a neighborhood legend.
              </p>

              {/* ── CORE MVP FEATURES (must be listed clearly) ── */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  { label: "Daily Micro-Tasks", detail: "Assigned from reports + common problems" },
                  { label: "Community Report Board", detail: "Influences future quests" },
                  { label: "City-Wide Leaderboard", detail: "Ranked by XP & tasks completed" },
                  { label: "XP, Levels & Streaks", detail: "Duolingo-style progression" },
                ].map((f) => (
                  <div key={f.label} className="bg-yellow-400/5 border border-yellow-400/15 rounded-lg p-2.5">
                    <p className="text-[10px] font-bold text-yellow-300" style={{ fontFamily: "var(--font-fredoka)" }}>{f.label}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{f.detail}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <LeaderboardPreview />
                <AchievementBadges />
              </div>
            </JourneyCard>
          </div>


          {/* ────────────────────────────────────────────
              STATION 5 — "The Big Drop" (Impact)
              
              Track curves LEFT → card on LEFT.
              Accent: amber again (the big payoff loop).
              The satisfying plunge — real impact numbers.
              ──────────────────────────────────────────── */}
          <div className="py-16 lg:w-[48%] lg:mr-auto">
            <JourneyCard
              side="left"
              station="Crew Bonus: +Impact"
              stationEmoji="💛"
              accentColor="text-amber-400"
              accentBorder="border-amber-400/25"
            >
              <h2 className="text-2xl font-bold text-slate-100 mb-2" style={hFont}>
                Our Impact <Heart className="inline w-4 h-4 text-red-400 ml-1" />
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Every quest completed is a small act that compounds into
                city-wide change. Users file real complaints — dirty streets,
                broken benches, areas needing group cleanup — and make genuine
                bonds completing quests together.
              </p>
              {stats.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {stats.map((stat) => (
                    <TicketCard key={stat.label}>
                      <StatCard {...stat} />
                    </TicketCard>
                  ))}
                </div>
              )}
            </JourneyCard>
          </div>


          {/* ────────────────────────────────────────────
              STATION 6 — "Postcards" (Gallery)
              
              Track curves RIGHT → card on RIGHT.
              Accent: pink.
              Souvenir photos — proof it's real.
              ──────────────────────────────────────────── */}
          {photos.length > 0 && (
            <div className="py-16 lg:w-[48%] lg:ml-auto">
              <JourneyCard
                side="right"
                station="Ride Photos"
                stationEmoji="📸"
                accentColor="text-red-400"
                accentBorder="border-red-400/25"
              >
                <h2 className="text-2xl font-bold text-slate-100 mb-6" style={hFont}>
                  Quests in the Wild
                </h2>
                <div className="space-y-3">
                  {photos.map((photo) => (
                    <PhotoCard key={photo.src} {...photo} />
                  ))}
                </div>
              </JourneyCard>
            </div>
          )}


          {/* ────────────────────────────────────────────
              STATION 7 — "The Crew" (Team Quotes)
              
              Track curves RIGHT → card on RIGHT.
              Accent: orange.
              Meet the devs who built the ride.
              ──────────────────────────────────────────── */}
          {teamQuotes.length > 0 && (
            <div className="py-16 lg:w-[48%] lg:ml-auto">
              <JourneyCard
                side="right"
                station="The Crew"
                stationEmoji="🎠"
                accentColor="text-orange-400"
                accentBorder="border-orange-400/25"
              >
                <h2 className="text-2xl font-bold text-slate-100 mb-2" style={hFont}>
                  Meet the Builders
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  The five devs behind ____Quest — why we built it, in our own words.
                </p>
                <div className="space-y-3">
                  {teamQuotes.map((t) => (
                    <TestimonialCard key={t.name} {...t} />
                  ))}
                </div>
              </JourneyCard>
            </div>
          )}


          {/* ────────────────────────────────────────────
              STATION 8 — "Next Stops" (Expansion)

              Track curves LEFT → card on LEFT.
              Accent: teal.
              Boston → nationwide → global.
              ──────────────────────────────────────────── */}
          <div className="pt-16 pb-32 lg:w-[48%] lg:mr-auto">
            <JourneyCard
              side="left"
              station="Next Stops on the Line"
              stationEmoji="🌍"
              accentColor="text-yellow-400"
              accentBorder="border-yellow-400/25"
            >
              <h2 className="text-2xl font-bold text-slate-100 mb-2" style={hFont}>
                {"Where We're Going "}
                <Globe className="inline w-5 h-5 text-yellow-400 ml-1" />
              </h2>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                We started in Boston — tackling trash, food insecurity, and
                neighborhood decay. But every city has quests waiting.
              </p>
              <div className="space-y-2">
                {([
                  { city: "Boston", status: "Live", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
                  { city: "Cambridge & Somerville", status: "Coming Q2", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
                  { city: "New York City", status: "2026", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
                  { city: "Nationwide", status: "The Vision", color: "text-red-400 bg-red-400/10 border-red-400/20" },
                ] as const).map((stop) => (
                  <div
                    key={stop.city}
                    className="flex items-center justify-between bg-slate-800/40 border border-slate-700/25 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm font-bold text-slate-200" style={hFont}>
                      {stop.city}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${stop.color}`}
                    >
                      {stop.status}
                    </span>
                  </div>
                ))}
              </div>
            </JourneyCard>
          </div>

        </div>
        {/* ── end content layer ── */}
      </div>
      {/* ── end journey wrapper ── */}


      <CarnivalBanner flip />


      {/* ══════════════════════════════════════════════════
          CTA — "Next Stop: You!"

          ISOLATED: own z-20, own bg. No track here.
          The ride ends — step off inspired and join.
          ══════════════════════════════════════════════════ */}
      <section
        className="relative z-20 px-4 py-28 text-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0E1528 0%, #0B1120 50%, #080E1A 100%)",
        }}
      >
        <ConfettiDots className="absolute inset-0" />

        {/* warm overhead glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 15%, rgba(245,158,11,0.05) 0%, transparent 50%)",
          }}
        />

        <ScrollReveal>
          <p
            className="text-[11px] font-bold tracking-[0.25em] uppercase text-amber-400/40 mb-4"
            style={hFont}
          >
            🎢 Next Stop: You!
          </p>

          <h2
            className="text-3xl sm:text-5xl font-extrabold leading-snug max-w-xl mx-auto text-slate-50"
            style={hFont}
          >
            {"Ready to make your neighborhood "}
            <span className="text-amber-400">legendary</span>?
          </h2>

          <p className="mt-5 text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Sign up, grab your first quest, and start earning XP today. Every
            small action levels up your community.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <NextLink
              href="/dashboard"
              className="inline-flex items-center bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full px-8 py-3 text-sm font-bold shadow-lg shadow-amber-400/15 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              style={hFont}
            >
              Start Your First Quest <Sparkles className="w-4 h-4 ml-1.5" />
            </NextLink>
            <NextLink
              href="/mission"
              className="inline-flex items-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full px-6 py-3 text-sm font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              style={hFont}
            >
              Learn More
            </NextLink>
          </div>
        </ScrollReveal>
      </section>

      <CarnivalBanner />
    </main>
  );
}
