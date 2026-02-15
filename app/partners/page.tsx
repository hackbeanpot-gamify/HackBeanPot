"use client";

import { Fredoka, Nunito } from "next/font/google";
import ArcadeNavbar from "@/components/ArcadeNavbar";
import { Users, Building2, HandshakeIcon, Trophy, Sparkles } from "lucide-react";

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
const hFont = { fontFamily: "var(--font-fredoka)" } as const;

interface PartnerCardProps {
  name: string;
  description: string;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
  benefits: string[];
}

function PartnerCard({ name, description, color, glowColor, icon, benefits }: PartnerCardProps) {
  return (
    <div
      className="relative group transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
      style={{
        background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 50%, #121228 100%)",
        borderRadius: "20px",
        border: `2px solid ${color}40`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 30px ${glowColor}`,
        padding: "28px",
      }}
    >
      {/* Icon badge */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            border: `2px solid ${color}`,
            boxShadow: `0 0 20px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div>
          <h3
            className="text-xl font-bold uppercase tracking-wide"
            style={{ color, ...hFont }}
          >
            {name}
          </h3>
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 4px ${glowColor}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed mb-6">{description}</p>

      {/* Benefits */}
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: "rgba(15,23,42,0.6)",
          border: `1px solid ${color}20`,
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ color: `${color}80`, ...hFont }}
        >
          Benefits
        </p>
        <ul className="space-y-2">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <span style={{ color, fontSize: "0.8rem", flexShrink: 0 }}>→</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[18px]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}

export default function PartnersPage() {
  const partners: PartnerCardProps[] = [
    {
      name: "Community Leaders",
      description:
        "Join us as a community leader and help shape the future of local volunteering in Boston.",
      color: "#f59e0b",
      glowColor: "rgba(245,158,11,0.15)",
      icon: <Trophy className="w-7 h-7" />,
      benefits: [
        "Featured profile highlighting your impact",
        "Early access to new quests and features",
        "Community recognition and achievement badges",
        "Direct input on platform development",
      ],
    },
    {
      name: "Organizations",
      description:
        "Partner with us to host raid boss events and connect with passionate volunteers ready to make a difference.",
      color: "#3b82f6",
      glowColor: "rgba(59,130,246,0.15)",
      icon: <Building2 className="w-7 h-7" />,
      benefits: [
        "Host large-scale volunteer events",
        "Access to engaged community members",
        "Event management dashboard",
        "Analytics and impact reporting",
      ],
    },
    {
      name: "Local Businesses",
      description:
        "Support your community by sponsoring quests and events while building brand awareness among engaged citizens.",
      color: "#e84b5c",
      glowColor: "rgba(232,75,92,0.15)",
      icon: <HandshakeIcon className="w-7 h-7" />,
      benefits: [
        "Quest sponsorship opportunities",
        "Brand visibility in app and events",
        "Corporate social responsibility impact",
        "Employee volunteer engagement programs",
      ],
    },
  ];

  return (
    <main
      className={`${fredoka.variable} ${nunito.variable} min-h-screen`}
      style={{
        fontFamily: "var(--font-nunito)",
        background: "linear-gradient(180deg, #080E1A 0%, #0B1120 40%, #0E1528 100%)",
      }}
    >
      <ArcadeNavbar />

      {/* Background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, rgba(245,158,11,0.04) 50%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative text-center pt-32 pb-12 px-4">
        <div className="inline-flex items-center gap-2 mb-4">
          <Users className="w-5 h-5" style={{ color: "#3b82f6" }} />
          <p
            className="text-[11px] font-bold tracking-[0.3em] uppercase"
            style={{ color: "rgba(59,130,246,0.5)", ...hFont }}
          >
            Join Forces
          </p>
          <Users className="w-5 h-5" style={{ color: "#3b82f6" }} />
        </div>
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold"
          style={{
            ...hFont,
            background: "linear-gradient(135deg, #3b82f6 0%, #f59e0b 50%, #e84b5c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 40px rgba(59,130,246,0.2)",
          }}
        >
          Partner With Us
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-base text-slate-400 leading-relaxed">
          Whether you're a{" "}
          <span className="font-semibold text-amber-300">community leader</span>, a{" "}
          <span className="font-semibold text-blue-400">local organization</span>, or a{" "}
          <span className="font-semibold text-red-400">business</span>, there's a place for
          you in our mission to transform Boston through gamified volunteering.
        </p>
      </div>

      {/* Partner Cards Grid */}
      <div className="relative max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, i) => (
            <PartnerCard key={i} {...partner} />
          ))}
        </div>

        {/* CTA Section */}
        <div
          className="relative mt-16 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 50%, #121228 100%)",
            border: "3px solid rgba(245,158,11,0.2)",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(245,158,11,0.08)",
          }}
        >
          {/* Top border glow */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(245,158,11,0.6), rgba(59,130,246,0.6), rgba(232,75,92,0.6), transparent)",
            }}
          />

          <div className="relative px-8 py-12 text-center">
            <Sparkles
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "#f59e0b" }}
            />
            <h2
              className="text-3xl font-bold uppercase tracking-wide mb-4"
              style={{
                ...hFont,
                background: "linear-gradient(135deg, #f59e0b 0%, #f6c453 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ready to Get Started?
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Fill out our partnership form and we'll get in touch within 48 hours to
              discuss how we can work together to make an impact.
            </p>
            <button
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 active:scale-95"
              style={{
                backgroundColor: "rgba(245,158,11,0.15)",
                border: "2px solid #f59e0b",
                boxShadow:
                  "0 0 20px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                color: "#f59e0b",
                ...hFont,
              }}
            >
              <HandshakeIcon className="w-5 h-5" />
              Become a Partner
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Console-style footer */}
            <div
              className="mt-8 pt-4 flex items-center justify-center gap-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    boxShadow: "0 0 8px rgba(34,197,94,0.5)",
                  }}
                />
                <span
                  className="text-[9px] uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Accepting Applications
                </span>
              </div>
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "rgba(245,158,11,0.3)" }}
              >
                🤝 Partners Portal
              </span>
            </div>
          </div>

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
            }}
          />
        </div>

        {/* Bottom decoration */}
        <div
          className="w-full max-w-[600px] h-[60px] mx-auto mt-4"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(59,130,246,0.06) 0%, transparent 70%)",
          }}
        />
      </div>
    </main>
  );
}
