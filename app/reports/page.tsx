"use client";

import { useState } from "react";
import { Fredoka, Nunito } from "next/font/google";
import { useReports } from "@/lib/hooks/useReports";
import ArcadeNavbar from "@/components/ArcadeNavbar";
import { Flag, Send, Sparkles, TrendingUp, Plus } from "lucide-react";

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

export default function ReportsPage() {
  const { submitComplaint, loading, error, lastResult } = useReports();
  const [complaint, setComplaint] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (complaint.trim().length < 5) return;

    const result = await submitComplaint(complaint.trim());
    if (result) {
      setComplaint("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  return (
    <main
      className={`${fredoka.variable} ${nunito.variable} min-h-screen`}
      style={{
        fontFamily: "var(--font-nunito)",
        background:
          "linear-gradient(180deg, #080E1A 0%, #0B1120 40%, #0E1528 100%)",
      }}
    >
      <ArcadeNavbar />

      {/* Background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232,75,92,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative text-center pt-20 pb-6 px-4">
        <div className="inline-flex items-center gap-2 mb-3">
          <Flag className="w-4 h-4" style={{ color: "#e84b5c" }} />
          <p
            className="text-[10px] font-bold tracking-[0.3em] uppercase"
            style={{ color: "rgba(232,75,92,0.5)", ...hFont }}
          >
            Report Issues
          </p>
          <Flag className="w-4 h-4" style={{ color: "#e84b5c" }} />
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
          style={{
            ...hFont,
            color: "rgb(248 250 252)",
            textShadow: "0 0 30px rgba(232,75,92,0.15)",
          }}
        >
          Report a Problem
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-sm text-slate-400 leading-relaxed">
          See something that needs fixing? <span className="text-amber-300 font-semibold">We'll turn it into a quest</span> for volunteers to tackle.
        </p>
      </div>

      {/* Main Console */}
      <div className="relative max-w-4xl mx-auto px-4 pb-12">
        <div
          className="relative"
          style={{
            background:
              "linear-gradient(145deg, #1a1a2e 0%, #16162a 50%, #121228 100%)",
            borderRadius: "28px 28px 48px 48px",
            border: "3px solid rgba(232,75,92,0.2)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(232,75,92,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
            padding: "24px",
          }}
        >
          {/* Console header */}
          <div className="flex items-center gap-7 mb-5">
            {/* Left: Power buttons */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0 w-[60px]">
              {[
                { c: "#e84b5c" },
                { c: "#f59e0b" },
                { c: "#3b82f6" },
                { c: "#22c55e" },
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    backgroundColor: b.c,
                    boxShadow: `0 0 10px ${b.c}66, inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)`,
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>

            {/* Center: Title */}
            <div className="flex-1 text-center">
              <h2
                className="text-2xl font-bold uppercase tracking-wide"
                style={{
                  ...hFont,
                  background:
                    "linear-gradient(135deg, #e84b5c 0%, #f6c453 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Complaint Terminal
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: i < 4 ? "#22c55e" : "#334155",
                      boxShadow:
                        i < 4 ? "0 0 6px rgba(34,197,94,0.6)" : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right: D-Pad */}
            <div className="flex-shrink-0 w-[60px] flex items-center justify-center">
              <div className="relative" style={{ width: 60, height: 60 }}>
                <div
                  className="absolute top-1/2 left-0 -translate-y-1/2"
                  style={{
                    width: 62,
                    height: 25,
                    backgroundColor: "#e84b5c",
                    borderRadius: "5px",
                    boxShadow:
                      "0 0 16px rgba(232,75,92,0.35), inset 0 -3px 5px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.1)",
                  }}
                />
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2"
                  style={{
                    width: 25,
                    height: 62,
                    backgroundColor: "#e84b5c",
                    borderRadius: "5px",
                    boxShadow:
                      "0 0 16px rgba(232,75,92,0.35), inset 0 -3px 5px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.1)",
                  }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Screen */}
          <div
            className="relative"
            style={{
              background: "linear-gradient(180deg, #0a0f1e 0%, #0d1325 100%)",
              borderRadius: "12px",
              border: "3px solid rgba(255,255,255,0.06)",
              padding: "20px",
              boxShadow:
                "inset 0 2px 10px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.2)",
              minHeight: "320px",
            }}
          >
            {/* Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[9px]"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
              }}
            />

            {/* Content */}
            <div className="relative">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-xs uppercase tracking-[0.15em] mb-2 font-bold"
                    style={{ color: "#e84b5c", ...hFont }}
                  >
                    What's the problem?
                  </label>
                  <textarea
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    placeholder="Example: Trash overflowing on Beacon St near the park..."
                    className="w-full px-4 py-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "rgba(15,23,42,0.8)",
                      border: "2px solid rgba(232,75,92,0.2)",
                      color: "#e2e8f0",
                      minHeight: "100px",
                      fontFamily: "var(--font-nunito)",
                    }}
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{
                        color:
                          complaint.length < 5
                            ? "rgba(148,163,184,0.4)"
                            : "#22c55e",
                      }}
                    >
                      {complaint.length < 5
                        ? `Min 5 chars (${complaint.length}/5)`
                        : `Ready! (${complaint.length} chars)`}
                    </span>
                    {complaint.length >= 5 && (
                      <span
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "#f59e0b" }}
                      >
                        ✓ Valid
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || complaint.trim().length < 5}
                  className="w-full group relative"
                >
                  <div
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300"
                    style={{
                      backgroundColor:
                        loading || complaint.trim().length < 5
                          ? "rgba(51,65,85,0.5)"
                          : "rgba(232,75,92,0.15)",
                      border:
                        loading || complaint.trim().length < 5
                          ? "2px solid rgba(100,116,139,0.3)"
                          : "2px solid #e84b5c",
                      boxShadow:
                        loading || complaint.trim().length < 5
                          ? "none"
                          : "0 0 20px rgba(232,75,92,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                      color:
                        loading || complaint.trim().length < 5
                          ? "#64748b"
                          : "#e84b5c",
                      ...hFont,
                    }}
                  >
                    {loading ? (
                      <>
                        <div
                          className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                          style={{ borderColor: "#64748b" }}
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Report
                        <Sparkles className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Error message */}
              {error && (
                <div
                  className="mt-6 px-4 py-3 rounded-lg flex items-center gap-3"
                  style={{
                    backgroundColor: "rgba(232,75,92,0.1)",
                    border: "2px solid rgba(232,75,92,0.3)",
                  }}
                >
                  <span style={{ color: "#e84b5c", fontSize: "1.2rem" }}>
                    ⚠️
                  </span>
                  <span className="text-sm" style={{ color: "#fca5a5" }}>
                    {error}
                  </span>
                </div>
              )}

              {/* Success feedback */}
              {showSuccess && lastResult && (
                <div
                  className="mt-6 px-5 py-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-4 duration-500"
                  style={{
                    backgroundColor: "rgba(34,197,94,0.1)",
                    border: "2px solid rgba(34,197,94,0.3)",
                    boxShadow: "0 0 20px rgba(34,197,94,0.15)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "1.5rem" }}>✅</span>
                    <span
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: "#22c55e", ...hFont }}
                    >
                      Report Received!
                    </span>
                  </div>

                  {lastResult.questAction ? (
                    <div className="space-y-2">
                      {lastResult.questAction.type === "created" ? (
                        <div
                          className="flex items-start gap-3 p-3 rounded-lg"
                          style={{
                            backgroundColor: "rgba(245,158,11,0.1)",
                            border: "1px solid rgba(245,158,11,0.2)",
                          }}
                        >
                          <Plus
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            style={{ color: "#f59e0b" }}
                          />
                          <div>
                            <p
                              className="text-xs font-bold uppercase tracking-wide mb-1"
                              style={{ color: "#f59e0b" }}
                            >
                              New Quest Created
                            </p>
                            <p className="text-sm" style={{ color: "#fcd34d" }}>
                              "{lastResult.questAction.questTitle}"
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex items-start gap-3 p-3 rounded-lg"
                          style={{
                            backgroundColor: "rgba(59,130,246,0.1)",
                            border: "1px solid rgba(59,130,246,0.2)",
                          }}
                        >
                          <TrendingUp
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            style={{ color: "#3b82f6" }}
                          />
                          <div>
                            <p
                              className="text-xs font-bold uppercase tracking-wide mb-1"
                              style={{ color: "#3b82f6" }}
                            >
                              Quest Priority Increased
                            </p>
                            <p className="text-sm" style={{ color: "#93c5fd" }}>
                              "{lastResult.questAction.questTitle}"
                            </p>
                            <p
                              className="text-xs mt-1"
                              style={{ color: "rgba(148,163,184,0.6)" }}
                            >
                              Weight: {lastResult.questAction.newWeight}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs" style={{ color: "#86efac" }}>
                      Your report was received. We're analyzing it now!
                    </p>
                  )}
                </div>
              )}

              {/* Info footer */}
              <div
                className="mt-5 pt-3 text-center"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: "rgba(148,163,184,0.3)" }}
                >
                  🤖 Powered by Gemini AI • Privacy-First Design
                </p>
              </div>
            </div>
          </div>

          {/* Console footer */}
          <div className="flex items-center justify-between mt-4 px-4">
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
                className="text-[9px] uppercase tracking-[0.15em] font-semibold"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Online
              </span>
            </div>
            <span
              className="text-[11px] font-bold uppercase tracking-[0.25em]"
              style={{ color: "rgba(232,75,92,0.4)", ...hFont }}
            >
              _Report
            </span>
            <div className="flex gap-[3px]">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 2,
                    height: 14,
                    borderRadius: "1px",
                    backgroundColor: "rgba(255,255,255,0.06)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom glow */}
        <div
          className="w-full max-w-[600px] h-[60px] mx-auto mt-[-1px]"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(232,75,92,0.06) 0%, transparent 70%)",
          }}
        />
      </div>
    </main>
  );
}
