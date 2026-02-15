"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Fredoka } from "next/font/google";
import {
  Home,
  Flag,
  Users,
  Ticket,
  User,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});
const hFont = { fontFamily: "var(--font-fredoka)" } as const;

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
}

const navLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <Sparkles className="w-4 h-4" />,
    color: "#3b82f6",
    glowColor: "rgba(59,130,246,0.3)",
  },
  {
    href: "/reports",
    label: "Report",
    icon: <Flag className="w-4 h-4" />,
    color: "#e84b5c",
    glowColor: "rgba(232,75,92,0.3)",
  },
  {
    href: "/partners",
    label: "Partners",
    icon: <Users className="w-4 h-4" />,
    color: "#f6c453",
    glowColor: "rgba(246,196,83,0.3)",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User className="w-4 h-4" />,
    color: "#ff8a3d",
    glowColor: "rgba(255,138,61,0.3)",
  },
];

export default function ArcadeNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navbar on landing page
  if (pathname === "/" || pathname === "/landing") {
    return null;
  }

  return (
    <nav
      className={`${fredoka.variable} fixed top-0 left-0 right-0 z-50`}
      style={{ fontFamily: "var(--font-fredoka)" }}
    >
      {/* Main navbar container - arcade console style */}
      <div className="relative">
        {/* Backdrop blur */}
        <div className="absolute inset-0 backdrop-blur-md" style={{ backgroundColor: "rgba(8,14,26,0.85)" }} />

        {/* Border glow effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4), rgba(59,130,246,0.4), rgba(232,75,92,0.4), rgba(246,196,83,0.4), transparent)",
          }}
        />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Arcade style */}
            <NextLink href="/profile" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Arcade coin */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #f6c453 100%)",
                    boxShadow: "0 0 20px rgba(245,158,11,0.4), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)",
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Ticket className="w-5 h-5" style={{ color: "#0B1120" }} />
                </div>
                {/* Coin glow */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                />
              </div>
              <div>
                <span
                  className="text-xl font-extrabold tracking-tight"
                  style={{
                    ...hFont,
                    background: "linear-gradient(135deg, #f59e0b 0%, #f6c453 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 20px rgba(245,158,11,0.2)",
                  }}
                >
                  Impact Trail
                </span>
                <div className="flex items-center gap-1 mt-[-2px]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: i < 3 ? "#22c55e" : "#334155",
                        boxShadow: i < 3 ? "0 0 4px rgba(34,197,94,0.5)" : "none",
                      }}
                    />
                  ))}
                  <span className="text-[7px] uppercase tracking-wider ml-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Power
                  </span>
                </div>
              </div>
            </NextLink>

            {/* Desktop Navigation - Arcade buttons */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    className="relative group"
                  >
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? `${link.color}15` : "rgba(15,23,42,0.6)",
                        border: isActive ? `2px solid ${link.color}` : "2px solid rgba(255,255,255,0.05)",
                        boxShadow: isActive
                          ? `0 0 15px ${link.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
                          : "inset 0 1px 0 rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* Icon with glow */}
                      <div
                        style={{
                          color: isActive ? link.color : "#94a3b8",
                          filter: isActive ? `drop-shadow(0 0 4px ${link.glowColor})` : "none",
                        }}
                      >
                        {link.icon}
                      </div>

                      {/* Label */}
                      <span
                        className="text-sm font-bold uppercase tracking-wide"
                        style={{
                          color: isActive ? link.color : "#94a3b8",
                          textShadow: isActive ? `0 0 10px ${link.glowColor}` : "none",
                        }}
                      >
                        {link.label}
                      </span>

                      {/* Active indicator LED */}
                      {isActive && (
                        <div
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{
                            backgroundColor: link.color,
                            boxShadow: `0 0 8px ${link.glowColor}`,
                          }}
                        />
                      )}
                    </div>

                    {/* Hover glow effect */}
                    <div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${link.glowColor} 0%, transparent 70%)`,
                        filter: "blur(10px)",
                      }}
                    />
                  </NextLink>
                );
              })}
            </div>

            {/* Mobile menu button - Arcade style */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative group"
              aria-label="Toggle menu"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: mobileMenuOpen ? "rgba(232,75,92,0.15)" : "rgba(15,23,42,0.6)",
                  border: mobileMenuOpen ? "2px solid #e84b5c" : "2px solid rgba(255,255,255,0.05)",
                  boxShadow: mobileMenuOpen
                    ? "0 0 15px rgba(232,75,92,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                    : "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" style={{ color: "#e84b5c" }} />
                ) : (
                  <Menu className="w-5 h-5" style={{ color: "#94a3b8" }} />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          }}
        />
      </div>

      {/* Mobile menu - Arcade dropdown style */}
      {mobileMenuOpen && (
        <div
          className="md:hidden relative"
          style={{
            backgroundColor: "rgba(8,14,26,0.95)",
            backdropFilter: "blur(16px)",
            borderBottom: "2px solid rgba(245,158,11,0.2)",
          }}
        >
          <div className="px-4 py-4 space-y-2 max-w-7xl mx-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <NextLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? `${link.color}15` : "rgba(15,23,42,0.6)",
                      border: isActive ? `2px solid ${link.color}` : "2px solid rgba(255,255,255,0.05)",
                      boxShadow: isActive
                        ? `0 0 15px ${link.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
                        : "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        color: isActive ? link.color : "#94a3b8",
                        filter: isActive ? `drop-shadow(0 0 4px ${link.glowColor})` : "none",
                      }}
                    >
                      {link.icon}
                    </div>
                    <span
                      className="text-sm font-bold uppercase tracking-wide flex-1"
                      style={{
                        color: isActive ? link.color : "#94a3b8",
                        textShadow: isActive ? `0 0 10px ${link.glowColor}` : "none",
                      }}
                    >
                      {link.label}
                    </span>
                    {isActive && (
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{
                          backgroundColor: link.color,
                          boxShadow: `0 0 8px ${link.glowColor}`,
                        }}
                      />
                    )}
                  </div>
                </NextLink>
              );
            })}
          </div>

          {/* Scanlines for mobile menu too */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
            }}
          />
        </div>
      )}
    </nav>
  );
}
