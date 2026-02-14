"use client";

import { Fredoka, Nunito } from "next/font/google";
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
} from "lucide-react";

import ConfettiDots from "@/components/about/ConfettiDots";
import CircusCharacters from "@/components/about/CircusCharacters";
import TicketCard from "@/components/about/TicketCard";
import StatCard from "@/components/about/StatCard";
import StepCard from "@/components/about/StepCard";
import TestimonialCard from "@/components/about/TestimonialCard";
import PhotoCard from "@/components/about/PhotoCard";
import FeatureCard from "@/components/about/FeatureCard";
import CarnivalBanner from "@/components/about/CarnivalBanner";
import HeroBadge from "@/components/about/HeroBadge";
import QuestCardDemo from "@/components/about/QuestCardDemo";
import LeaderboardPreview from "@/components/about/LeaderboardPreview";
import XpBar from "@/components/about/XpBar";
import StreakCounter from "@/components/about/StreakCounter";
import AchievementBadges from "@/components/about/AchievementBadges";
import TrackSegment from "@/components/about/TrackSegment";
import StationLabel from "@/components/about/StationLabel";
import ScrollReveal from "@/components/about/ScrollReveal";

/* ─── fonts ─── */
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700"],
});

/* ─── static data ─── */

const stats = [
  { icon: Target, label: "Quests Completed", value: "12,847", accent: "bg-pink-100 text-pink-500" },
  { icon: Trash2, label: "Lbs Trash Collected", value: "6,320", accent: "bg-yellow-100 text-yellow-600" },
  { icon: Clock, label: "Volunteer Hours", value: "34,500+", accent: "bg-sky-100 text-sky-500" },
  { icon: MapPin, label: "Neighborhoods Helped", value: "73", accent: "bg-emerald-100 text-emerald-500" },
  { icon: Users, label: "Active Questers", value: "4,210", accent: "bg-orange-100 text-orange-500" },
  { icon: TreePine, label: "Trees Planted", value: "1,085", accent: "bg-emerald-50 text-emerald-500" },
];

const steps = [
  { num: "1", title: "Report an Issue", desc: "Spot something in your neighborhood? Drop a pin and describe the problem.", icon: Flag, color: "bg-pink-400" },
  { num: "2", title: "Quests Generated", desc: "Our system turns reports into bite-sized daily quests anyone can pick up.", icon: Sparkles, color: "bg-yellow-400" },
  { num: "3", title: "Complete & Prove", desc: "Head out, complete the quest, and upload a photo as proof.", icon: Camera, color: "bg-sky-400" },
  { num: "4", title: "Earn XP & Rise", desc: "Gain XP, extend your streak, and climb the community leaderboard.", icon: Trophy, color: "bg-emerald-400" },
];

const testimonials = [
  { name: "Mia Chen", handle: "@mia_quests", avatar: "🎀", quote: "I started doing quests on my morning jog — 42-day streak and my block has never looked cleaner!", rating: 5 },
  { name: "Jordan Ellis", handle: "@jordan_e", avatar: "🎯", quote: "The raid boss event downtown was unreal. 200 people showed up to restore the community garden.", rating: 5 },
  { name: "Priya Kapoor", handle: "@priyak", avatar: "🌸", quote: "My kids think they\u2019re playing a game. I think they\u2019re becoming better humans. Win-win.", rating: 5 },
];

const photos = [
  { src: "/images/beach-cleanup.jpg", alt: "Beach cleanup quest in action", caption: "Quest #4,012 — Revere Beach cleanup, 48 volunteers strong 🏖️" },
  { src: "/images/community.jpg", alt: "Community gathering in Boston", caption: "Raid Boss event in Dorchester — neighbors united 💛" },
];

const featureCards = [
  { icon: Target, title: "Daily Quests", desc: "Bite-sized tasks generated from real community reports — pick one up on your commute, lunch break, or weekend walk.", color: "text-pink-500", bg: "bg-pink-50/80 border-pink-200/60" },
  { icon: Flag, title: "Report Board", desc: "Anyone can flag an issue — litter, broken benches, overgrown lots. Reports feed the quest engine so nothing goes unnoticed.", color: "text-yellow-500", bg: "bg-yellow-50/80 border-yellow-200/60" },
  { icon: Flame, title: "Streaks, XP & Leaderboards", desc: "Keep your streak alive, level up, and compete with friends. Community impact has never felt this rewarding.", color: "text-sky-500", bg: "bg-sky-50/80 border-sky-200/60" },
  { icon: Swords, title: "Raid Boss Events", desc: "Large-scale community challenges — park restorations, river cleanups, mural projects — where the whole server teams up.", color: "text-emerald-500", bg: "bg-emerald-50/80 border-emerald-200/60" },
];

/* ═══════════════════ PAGE ═══════════════════ */

export default function AboutPage() {
  return (
    <main className={`${fredoka.variable} ${nunito.variable} min-h-screen overflow-x-hidden`} style={{ fontFamily: "var(--font-nunito)" }}>

      {/* ───────── 1 · HERO — "Welcome to the Ride!" ───────── */}
      <section className="relative isolate px-4 pt-28 pb-24 text-center overflow-hidden bg-[#FFF7ED]">
        <ConfettiDots className="absolute inset-0" />
        <CircusCharacters className="absolute inset-0" />

        {/* soft radial warmth */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, #FECDD3 0%, transparent 60%)",
          }}
        />

        <ScrollReveal>
          <HeroBadge>
            <PartyPopper className="w-4 h-4 mr-1.5" /> Now in beta
          </HeroBadge>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p
            className="text-sm font-bold tracking-[0.25em] uppercase text-pink-400 mb-3"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            🎪 Step right up! 🎪
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none text-gray-800"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            ____Quest
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
            We turn community issues into{" "}
            <span className="font-bold text-pink-500">daily quests</span> and
            volunteering into a{" "}
            <span className="font-bold text-sky-500">multiplayer game</span>.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="inline-flex items-center bg-pink-400 hover:bg-pink-500 text-white rounded-full px-8 py-3 text-base font-bold shadow-md shadow-pink-200/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Grab Your Ticket <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <button
              className="inline-flex items-center border-2 border-sky-300 text-sky-500 hover:bg-sky-50 rounded-full px-8 py-3 text-base font-bold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <Flag className="w-4 h-4 mr-2" /> Report an Issue
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <div className="mt-14 flex justify-center">
            <div
              className="inline-flex items-center gap-2 text-xs text-pink-300 tracking-[0.2em] uppercase select-none font-bold border-t border-b border-dashed border-pink-200 py-2 px-6"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <Ticket className="w-4 h-4" /> admit one quester{" "}
              <Ticket className="w-4 h-4 rotate-180" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      <CarnivalBanner />
      <TrackSegment direction="right" color="#F9A8D4" />

      {/* ───────── 2 · WHAT WE DO — "The Big Top" ───────── */}
      <section className="relative px-4 py-20 max-w-5xl mx-auto">
        <ScrollReveal>
          <StationLabel label="The Big Top" number={1} variant="pink" />
          <h2
            className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            What We Do <Sparkles className="inline w-6 h-6 text-yellow-400 ml-1" />
          </h2>
          <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
            We gamify community service by connecting local people, helping
            organizations find volunteers, and empowering individuals to make real
            impact through fun, habit-building daily challenges.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {featureCards.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
              <FeatureCard {...item} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <TrackSegment direction="left" color="#FDE68A" />

      {/* ───────── 2.5 · TRY IT — "The Fun House" ───────── */}
      <section className="px-4 py-20 bg-yellow-50/50">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <StationLabel label="The Fun House" number={2} variant="yellow" />
            <h2
              className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-3"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Try It Yourself <Gamepad2 className="inline w-7 h-7 text-yellow-500 ml-1" />
            </h2>
            <p className="text-center text-gray-500 max-w-lg mx-auto mb-12">
              Click a quest card to see the loop in action — accept, prove, earn XP! 🎟️
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <ScrollReveal direction="left">
              <div className="space-y-5">
                <QuestCardDemo />
                <QuestCardDemo
                  title="Plant 5 trees in Franklin Park"
                  location="Franklin Park, Boston"
                  xpReward={250}
                  timeEstimate="~1 hr"
                  difficulty="Medium"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="space-y-5">
                <XpBar level={12} currentXp={3_420} maxXp={5_000} title="Community Hero" />
                <StreakCounter streakDays={42} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <TrackSegment direction="right" color="#7DD3FC" />

      {/* ───────── 3 · HOW IT WORKS — "The Climb" ───────── */}
      <section className="px-4 py-20 bg-sky-50/40">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <StationLabel label="The Climb" number={3} variant="blue" />
            <h2
              className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-14"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              How It Works
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.12}>
                <StepCard {...step} showConnector={i < steps.length - 1} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <TrackSegment direction="left" color="#6EE7B7" />

      {/* ───────── 3.5 · LEADERBOARD — "The Prize Booth" ───────── */}
      <section className="px-4 py-20 bg-emerald-50/30">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <StationLabel label="The Prize Booth" number={4} variant="mint" />
            <h2
              className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-3"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Compete &amp; Collect
            </h2>
            <p className="text-center text-gray-500 max-w-lg mx-auto mb-12">
              Climb the leaderboard, unlock badges, and become a neighborhood legend. Every quest counts. 🏆
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal direction="left">
              <LeaderboardPreview />
            </ScrollReveal>
            <ScrollReveal direction="right">
              <AchievementBadges />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <CarnivalBanner flip />
      <TrackSegment direction="right" color="#FDBA74" />

      {/* ───────── 4 · IMPACT — "The Big Drop" ───────── */}
      <section className="relative px-4 py-20 max-w-5xl mx-auto">
        <ConfettiDots className="absolute inset-0" />

        <ScrollReveal>
          <StationLabel label="The Big Drop" number={5} variant="peach" />
          <h2
            className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Our Impact <Heart className="inline w-6 h-6 text-pink-400 ml-1" />
          </h2>
          <p className="text-center text-gray-500 max-w-xl mx-auto mb-12">
            Every quest completed is a small act that compounds into city-wide
            change. Here&apos;s what our community has accomplished so far.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.08}>
              <TicketCard className="transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.03]">
                <StatCard {...stat} />
              </TicketCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <TrackSegment direction="left" color="#F9A8D4" />

      {/* ───────── 5 · PHOTO GALLERY — "Postcards from the Ride" ───────── */}
      <section className="px-4 py-20 bg-pink-50/30 max-w-5xl mx-auto">
        <ScrollReveal>
          <StationLabel label="Postcards from the Ride" number={6} variant="pink" />
          <h2
            className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Quests in the Wild
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-8">
          {photos.map((photo, i) => (
            <ScrollReveal key={photo.src} delay={i * 0.15} direction={i === 0 ? "left" : "right"}>
              <PhotoCard {...photo} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <TrackSegment direction="right" color="#FDE68A" />

      {/* ───────── 6 · COMMUNITY FEEL — "Fellow Riders" ───────── */}
      <section className="px-4 py-20 bg-yellow-50/30">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <StationLabel label="Fellow Riders" number={7} variant="yellow" />
            <h2
              className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Player Quotes
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.1}>
                <TestimonialCard {...t} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <TrackSegment direction="left" color="#7DD3FC" />

      {/* ───────── 7 · FINAL CTA — "Next Stop: You!" ───────── */}
      <section className="relative px-4 py-28 text-center overflow-hidden bg-[#FFF7ED]">
        <ConfettiDots className="absolute inset-0" />
        <CircusCharacters
          className="absolute inset-0"
          characters={["🎈", "🍿", "🎠", "🎪", "🎡", "🎟️"]}
        />

        <div className="absolute inset-x-0 top-0">
          <CarnivalBanner />
        </div>

        <ScrollReveal>
          <div className="relative z-10 mt-4">
            <StationLabel label="Next Stop: You!" variant="blue" />

            <h2
              className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-2xl mx-auto text-gray-800"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              Ready to make your neighborhood{" "}
              <span className="text-pink-400">legendary</span>?
            </h2>

            <p className="mt-4 text-gray-500 max-w-lg mx-auto">
              Sign up, grab your first quest, and start earning XP today. Every
              small action levels up your community. 🎢
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="inline-flex items-center bg-pink-400 hover:bg-pink-500 text-white rounded-full px-10 py-3.5 text-base font-bold shadow-md shadow-pink-200/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                Start Your First Quest <Sparkles className="w-4 h-4 ml-2" />
              </button>
              <button
                className="inline-flex items-center text-sky-500 hover:bg-sky-50 rounded-full px-8 py-3.5 text-base font-bold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                Learn More
              </button>
            </div>

            <div className="mt-12 flex justify-center gap-3 text-xl select-none opacity-20" aria-hidden>
              🎈 🎪 🍭 🎡 🎠 🍿 🎟️ 🎀
            </div>
          </div>
        </ScrollReveal>

        <div className="absolute inset-x-0 bottom-0">
          <CarnivalBanner flip />
        </div>
      </section>
    </main>
  );
}
