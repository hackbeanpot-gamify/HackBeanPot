"use client";

import { useState, useEffect } from "react";
import { Fredoka, Nunito } from "next/font/google";
import NextLink from "next/link";
import {
  Sparkles,
  ChevronRight,
  Ticket,
  PartyPopper,
  Flag,
} from "lucide-react";

import ConfettiDots from "@/components/about/ConfettiDots";
import CarnivalBanner from "@/components/about/CarnivalBanner";
import HeroBadge from "@/components/about/HeroBadge";
import ScrollReveal from "@/components/about/ScrollReveal";
import { createClient } from "@/lib/supabase/client";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "500", "600", "700", "800"] });
const hFont = { fontFamily: "var(--font-fredoka)" } as const;

interface LeaderboardEntry {
  rank: number; id: number; username: string; displayName: string | null;
  avatarUrl: string | null; city: string | null; xp: number; level: number; currentStreak: number;
}

function useLeaderboard(limit = 5) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const sb = createClient();
        const { data } = await sb.from("cityLeaderboard").select("*").limit(limit);
        if (data) setEntries(data);
      } catch {}
      setLoading(false);
    })();
  }, [limit]);
  return { entries, loading };
}

/* ── Cart ── */
function Cart({ title, items, accent, borderColor, rotation, emoji }: {
  title: string; items: string[]; accent: string; borderColor: string; rotation: string; emoji: string;
}) {
  return (
    <div className="relative transition-transform duration-500 hover:scale-105" style={{ transform: `rotate(${rotation})` }}>
      <div className="rounded-2xl px-6 py-5 w-[350px] relative overflow-hidden"
        style={{ backgroundColor: "rgba(15,23,42,0.95)", border: `2px solid ${borderColor}`, boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 25px ${borderColor}15` }}>
        <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none" style={{ background: `linear-gradient(180deg, ${borderColor}08 0%, transparent 100%)` }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: "1.2rem" }}>{emoji}</span>
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: accent, ...hFont }}>{title}</h3>
          </div>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-slate-300 leading-relaxed">
                <span className="mt-0.5 flex-shrink-0" style={{ color: accent }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center gap-20 -mt-[2px]">
        {[0, 1].map(w => (
          <div key={w} style={{ width: 22, height: 22, borderRadius: "50%", border: `2.5px solid ${accent}`, backgroundColor: "rgba(15,23,42,0.95)", boxShadow: `0 0 10px ${borderColor}33` }}>
            <div className="absolute" style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: accent, margin: "5px auto", left: "50%", transform: "translateX(-50%)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Leaderboard Console ── */
function LeaderboardConsole({ entries, loading }: { entries: LeaderboardEntry[]; loading: boolean }) {
  const medals = ["🥇", "🥈", "🥉"];
  const colors = ["#f59e0b", "#94a3b8", "#cd7f32"];
  return (
    <div className="relative w-full max-w-[720px] mx-auto" style={{
      background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 50%, #121228 100%)",
      borderRadius: "22px 22px 38px 38px", border: "3px solid rgba(255,255,255,0.08)",
      boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(245,158,11,0.04)", padding: "24px",
    }}>
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
          {[["#e84b5c","0.5"],["#f6c453","0.5"],["#22c55e","0.5"]].map(([c,o],i)=>(
            <div key={i} style={{ width:18,height:18,borderRadius:"50%",backgroundColor:c,boxShadow:`0 0 8px ${c}88`,border:"1px solid rgba(0,0,0,0.2)" }}/>
          ))}
        </div>
        <div className="flex-1 relative" style={{
          background: "linear-gradient(180deg, #0a0f1e, #0d1325)", borderRadius: "10px",
          border: "3px solid rgba(255,255,255,0.05)", padding: "18px 22px",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)", minHeight: "220px",
        }}>
          <div className="absolute inset-0 pointer-events-none rounded-[7px]" style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)"
          }} />
          <div className="relative">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-center mb-4" style={{ color: "#f59e0b", ...hFont }}>🏆 Leaderboard</h3>
            {loading ? (
              <div className="text-center py-6"><div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin mx-auto" style={{ borderColor: "#f59e0b", borderTopColor: "transparent" }} /></div>
            ) : entries.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">No data yet</div>
            ) : (
              <div className="space-y-1.5">
                {entries.map((e, i) => (
                  <div key={e.id} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{
                    backgroundColor: i === 0 ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.015)",
                    border: i === 0 ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
                  }}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm w-6 text-center font-bold" style={{ color: colors[i] || "#64748b" }}>{i < 3 ? medals[i] : i+1}</span>
                      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-bold" style={{
                        backgroundColor: "rgba(245,158,11,0.12)", border: `1.5px solid ${colors[i]||"rgba(148,163,184,0.2)"}`, color: colors[i]||"#94a3b8"
                      }}>
                        {e.avatarUrl ? <img src={e.avatarUrl} alt="" className="w-full h-full object-cover"/> : (e.displayName||e.username).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{e.displayName||e.username}</span>
                        <span className="text-[9px] text-slate-500">LVL {e.level} · 🔥 {e.currentStreak}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>{e.xp.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative" style={{ width:52,height:52 }}>
            <div className="absolute top-1/2 left-0 -translate-y-1/2" style={{ width:52,height:18,backgroundColor:"#e84b5c",borderRadius:"3px",boxShadow:"0 0 10px rgba(232,75,92,0.25)" }}/>
            <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width:18,height:52,backgroundColor:"#e84b5c",borderRadius:"3px",boxShadow:"0 0 10px rgba(232,75,92,0.25)" }}/>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-5 px-3">
        <div className="flex items-center gap-1.5">
          <div style={{ width:5,height:5,borderRadius:"50%",backgroundColor:"#22c55e",boxShadow:"0 0 6px rgba(34,197,94,0.5)" }}/>
          <span className="text-[8px] uppercase tracking-wider" style={{ color:"rgba(255,255,255,0.15)" }}>Online</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color:"rgba(245,158,11,0.3)",...hFont }}>_Quest</span>
        <div className="flex gap-[2px]">{[...Array(5)].map((_,i)=>(<div key={i} style={{ width:2,height:12,borderRadius:"1px",backgroundColor:"rgba(255,255,255,0.05)" }}/>))}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const { entries, loading } = useLeaderboard(5);

  return (
    <main className={`${fredoka.variable} ${nunito.variable} min-h-screen overflow-x-hidden`} style={{ fontFamily: "var(--font-nunito)", backgroundColor: "#0B1120" }}>

      {/* ══ HERO (UNCHANGED) ══ */}
      <section className="relative z-20 isolate px-4 pt-32 pb-28 text-center overflow-hidden" style={{ background: "linear-gradient(180deg, #080E1A 0%, #0B1120 60%, #0E1528 100%)" }}>
        <ConfettiDots className="absolute inset-0" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(245,158,11,0.07) 0%, transparent 55%)" }} />
        <ScrollReveal><HeroBadge><PartyPopper className="w-3.5 h-3.5 mr-1.5" /> Now in beta</HeroBadge></ScrollReveal>
        <ScrollReveal delay={0.1}><p className="text-[11px] font-bold tracking-[0.35em] uppercase text-amber-400/40 mb-3" style={hFont}>🎪 All Aboard! 🎪</p></ScrollReveal>
        <ScrollReveal delay={0.15}><h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none text-slate-50" style={hFont}>Impact Quest</h1></ScrollReveal>
        <ScrollReveal delay={0.25}><p className="mt-6 max-w-lg mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">We turn community issues into <span className="font-semibold text-amber-300">daily quests</span> and volunteering into a <span className="font-semibold text-red-400">multiplayer game</span>.</p></ScrollReveal>
        <ScrollReveal delay={0.35}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">

            <NextLink href="/auth/login" className="inline-flex items-center bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full px-7 py-2.5 text-sm font-bold shadow-lg shadow-amber-400/15 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95" style={hFont}>Sign In <ChevronRight className="w-4 h-4 ml-1" /></NextLink>
            <button 
            className="inline-flex items-center border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-full px-7 py-2.5 text-sm font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95" 
            style={hFont}
            ><Flag className="w-3.5 h-3.5 mr-1.5" /> Report an Issue</button>

            <NextLink href="/dashboard" className="inline-flex items-center bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full px-7 py-2.5 text-sm font-bold shadow-lg shadow-amber-400/15 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95" style={hFont}>Sign In <ChevronRight className="w-4 h-4 ml-1" /></NextLink>
            <button className="inline-flex items-center border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-full px-7 py-2.5 text-sm font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95" style={hFont}><Flag className="w-3.5 h-3.5 mr-1.5" /> Report an Issue</button>

          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.6}>
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-2 text-[10px] text-amber-400/25 tracking-[0.2em] uppercase select-none font-bold border-t border-b border-dashed border-slate-700/50 py-1.5 px-5" style={hFont}>
              <Ticket className="w-3.5 h-3.5" /> admit one quester <Ticket className="w-3.5 h-3.5 rotate-180" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      <CarnivalBanner />

      {/* ══ NEW MIDDLE: ROLLING TEXT + TRACK + CARTS + LEADERBOARD ══ */}

      {/* Rolling text along a curved track */}
      <section className="relative py-8 overflow-hidden">
        <svg viewBox="0 0 1400 350" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <path id="rollerPath" d="M-20 280 C200 30, 400 320, 600 180 S900 20, 1100 200 S1350 320, 1450 100" fill="none" />
          </defs>
          {/* Track rails */}
          <use href="#rollerPath" stroke="#d4a574" strokeWidth="5" fill="none" opacity="0.5" />
          <path d="M-20 296 C200 46, 400 336, 600 196 S900 36, 1100 216 S1350 336, 1450 116" stroke="#d4a574" strokeWidth="5" fill="none" opacity="0.3" />
          {/* Cross ties */}
          {Array.from({ length: 35 }, (_, i) => {
            const t = i / 34;
            const x = -20 + t * 1470;
            return <line key={i} x1={x} y1={0} x2={x} y2={350} stroke="#b8956e" strokeWidth="1.5" opacity="0.04" />;
          })}
          {/* Rolling text */}
          <text style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700 }}>
            <textPath href="#rollerPath" startOffset="15%" fill="#e84b5c" fontSize="52" letterSpacing="3">
              ROLL WITH YOUR COMMUNITY
            </textPath>
          </text>
        </svg>
      </section>

      {/* Carts */}
      <section className="relative pb-24 overflow-hidden">
        {/* Background track continuation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1400 600" preserveAspectRatio="none" fill="none">
          <path d="M-50 50 C200 200, 400 -50, 700 150 S1100 350, 1450 100" stroke="#d4a574" strokeWidth="3" opacity="0.15" />
          <path d="M-50 65 C200 215, 400 -35, 700 165 S1100 365, 1450 115" stroke="#d4a574" strokeWidth="3" opacity="0.1" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-6">
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8">
              <Cart title="What We Do?" emoji="🎯" accent="#f59e0b" borderColor="rgba(245,158,11,0.4)" rotation="-3deg"
                items={["Connect local people", "Find volunteers to complete daily quests", "Build stronger communities"]} />
              <Cart title="How We Do It?" emoji="⚙️" accent="#ff8a3d" borderColor="rgba(255,138,61,0.4)" rotation="1.5deg"
                items={["Find common problems in Boston", "Take user input & reports", "Turn them into daily quests"]} />
              <Cart title="Why We Do It?" emoji="💛" accent="#e84b5c" borderColor="rgba(232,75,92,0.4)" rotation="-2deg"
                items={["Empower individuals", "Build good habits through streaks", "Help organizations find people", "Allow people to give back"]} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Leaderboard Console */}
      <section className="relative py-20 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(245,158,11,0.04) 0%, transparent 70%)" }} />
        <ScrollReveal><h2 className="relative text-3xl sm:text-4xl font-bold text-center mb-10 uppercase tracking-wide" style={{ ...hFont, color: "#f59e0b", textShadow: "0 0 20px rgba(245,158,11,0.12)" }}>Leaderboard</h2></ScrollReveal>
        <ScrollReveal delay={0.15}><LeaderboardConsole entries={entries} loading={loading} /></ScrollReveal>
      </section>

      <CarnivalBanner flip />

      {/* ══ CTA (UNCHANGED) ══ */}
      <section className="relative z-20 px-4 py-28 text-center overflow-hidden" style={{ background: "linear-gradient(180deg, #0E1528 0%, #0B1120 50%, #080E1A 100%)" }}>
        <ConfettiDots className="absolute inset-0" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(245,158,11,0.05) 0%, transparent 50%)" }} />
        <ScrollReveal>
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-amber-400/40 mb-4" style={hFont}>🎢 Next Stop: You!</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-snug max-w-xl mx-auto text-slate-50" style={hFont}>Ready to make your neighborhood <span className="text-amber-400">legendary</span>?</h2>
          <p className="mt-5 text-slate-400 max-w-md mx-auto text-sm leading-relaxed">Sign up, grab your first quest, and start earning XP today. Every small action levels up your community.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">

            <NextLink href="/auth/login" className="inline-flex items-center bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full px-8 py-3 text-sm font-bold shadow-lg shadow-amber-400/15 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95" style={hFont}>Start Your First Quest <Sparkles className="w-4 h-4 ml-1.5" /></NextLink>

            <NextLink href="/dashboard" className="inline-flex items-center bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full px-8 py-3 text-sm font-bold shadow-lg shadow-amber-400/15 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95" style={hFont}>Start Your First Quest <Sparkles className="w-4 h-4 ml-1.5" /></NextLink>

            <NextLink href="/mission" className="inline-flex items-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full px-6 py-3 text-sm font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95" style={hFont}>Learn More</NextLink>
          </div>
        </ScrollReveal>
      </section>
      <CarnivalBanner />
    </main>
  );
}