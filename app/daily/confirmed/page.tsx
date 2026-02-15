/**
 * app/daily/confirmed/page.tsx
 *
 * Success/error page shown after clicking the email confirmation link.
 * Reads query params to show the result.
 */

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmedContent() {
  const params = useSearchParams();

  const success = params.get("success") === "true";
  const error = params.get("error");
  const quest = params.get("quest");
  const xp = params.get("xp");
  const xpTotal = params.get("xpTotal");
  const level = params.get("level");
  const streak = params.get("streak");

  // ── Error state ──
  if (error) {
    const errorMessages: Record<string, string> = {
      missing_params: "Invalid link — missing parameters.",
      invalid_token: "Invalid or expired confirmation link.",
    };

    const friendlyError = errorMessages[error] ?? decodeURIComponent(error);
    const isAlreadyDone = error.includes("already completed");

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">{isAlreadyDone ? "✅" : "⚠️"}</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isAlreadyDone ? "Already Completed!" : "Oops!"}
          </h1>
          <p className="text-slate-400 mb-6">{friendlyError}</p>
          <a
            href="/daily"
            className="inline-block bg-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-violet-500 transition"
          >
            Go to Daily Quest →
          </a>
        </div>
      </div>
    );
  }

  // ── Success state ──
  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Quest Complete!
          </h1>
          <p className="text-slate-400 mb-6">
            You finished <span className="text-white font-semibold">&ldquo;{quest}&rdquo;</span>
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">XP Earned</p>
              <p className="text-2xl font-extrabold text-amber-400">+{xp}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Total XP</p>
              <p className="text-2xl font-extrabold text-white">{xpTotal}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Level</p>
              <p className="text-2xl font-extrabold text-violet-400">{level}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Streak</p>
              <p className="text-2xl font-extrabold text-orange-400">{streak} 🔥</p>
            </div>
          </div>

          <a
            href="/daily"
            className="inline-block bg-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-violet-500 transition"
          >
            Back to Dashboard →
          </a>
        </div>
      </div>
    );
  }

  // ── Fallback ──
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Loading...</p>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      }
    >
      <ConfirmedContent />
    </Suspense>
  );
}
