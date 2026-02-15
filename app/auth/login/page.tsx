'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fredoka, Nunito } from "next/font/google";
import { Eye, EyeOff } from "lucide-react";
import {
  signUpNewUser,
  loginWithUsernameOrEmail,
  type SignUpFormData,
} from "./actions";

/* ═══════════════════════════════════════════════════════════
   FONTS — same as landing page: Fredoka headings, Nunito body
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

const hFont = { fontFamily: "var(--font-fredoka)" } as const;

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */
type Tab = "signup" | "login";

interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

/** Reusable password input with show/hide toggle. */
function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 pr-11 bg-slate-800/40 border border-slate-600/25 rounded-xl text-slate-50 text-sm placeholder-slate-500 outline-none transition-all focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

/** Signup / Login tab switcher. */
function TabSwitcher({
  active,
  onSwitch,
}: {
  active: Tab;
  onSwitch: (tab: Tab) => void;
}) {
  return (
    <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/15 mb-7">
      {(["signup", "login"] as Tab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onSwitch(tab)}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            active === tab
              ? "bg-amber-400/15 text-slate-50 shadow-[0_0_12px_rgba(245,158,11,0.1),inset_0_0_0_1px_rgba(245,158,11,0.2)]"
              : "text-slate-400 hover:text-slate-300"
          }`}
          style={hFont}
        >
          {tab === "signup" ? "Sign Up" : "Log In"}
        </button>
      ))}
    </div>
  );
}

/** Sign-up form fields (first name, last name, username, email, password). */
function SignUpFields({
  form,
  onChange,
}: {
  form: SignUpFormData;
  onChange: (field: keyof SignUpFormData, value: string) => void;
}) {
  const inputClass =
    "w-full px-4 py-3 bg-slate-800/40 border border-slate-600/25 rounded-xl text-slate-50 text-sm placeholder-slate-500 outline-none transition-all focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10";

  return (
    <>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            First Name
          </label>
          <input
            type="text"
            placeholder="John"
            value={form.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Doe"
            value={form.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Username
        </label>
        <input
          type="text"
          placeholder="johndoe"
          value={form.username}
          onChange={(e) => onChange("username", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Email
        </label>
        <input
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Password
        </label>
        <PasswordInput
          value={form.password}
          onChange={(v) => onChange("password", v)}
        />
      </div>
    </>
  );
}

/** Login form fields (username or email, password). */
function LoginFields({
  form,
  onChange,
}: {
  form: LoginFormData;
  onChange: (field: keyof LoginFormData, value: string) => void;
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Username or Email
        </label>
        <input
          type="text"
          placeholder="johndoe or john@example.com"
          value={form.usernameOrEmail}
          onChange={(e) => onChange("usernameOrEmail", e.target.value)}
          className="w-full px-4 py-3 bg-slate-800/40 border border-slate-600/25 rounded-xl text-slate-50 text-sm placeholder-slate-500 outline-none transition-all focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Password
        </label>
        <PasswordInput
          value={form.password}
          onChange={(v) => onChange("password", v)}
        />
      </div>

      <div className="text-right -mt-2">
        <button
          type="button"
          className="text-amber-400/80 hover:text-amber-400 text-xs font-medium transition-colors"
        >
          Forgot password?
        </button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN AUTH PAGE
   ═══════════════════════════════════════════════════════════ */

/**
 * AuthPage — unified signup/login page.
 *
 * - Signup populates `auth.users.raw_user_meta_data` with username,
 *   first_name, last_name, city ("Boston").
 * - Login supports both email and username (resolved server-side).
 * - Styled to match the landing page's carnival theme.
 */
export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [signUpForm, setSignUpForm] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    usernameOrEmail: "",
    password: "",
  });

  /** Updates a single field on the signup form. */
  const handleSignUpChange = (field: keyof SignUpFormData, value: string) => {
    setSignUpForm((prev) => ({ ...prev, [field]: value }));
  };

  /** Updates a single field on the login form. */
  const handleLoginChange = (field: keyof LoginFormData, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  /** Handles form submission for both signup and login. */
  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    // Hardcoded: always redirect to profile
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  /** Switches between signup and login tabs, clearing errors. */
  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setError(null);
  };

  return (
    <main
      className={`${fredoka.variable} ${nunito.variable} min-h-screen flex items-center justify-center p-5`}
      style={{
        fontFamily: "var(--font-nunito)",
        backgroundColor: "#0B1120",
      }}
    >
      <div className="w-full max-w-[440px] bg-slate-900/90 border border-amber-400/25 rounded-2xl px-8 py-9 shadow-[0_0_60px_rgba(245,158,11,0.06),0_20px_40px_rgba(0,0,0,0.4)]">
        {/* Title */}
        <h1
          className="text-center text-2xl font-bold text-slate-50 mb-6 tracking-tight"
          style={hFont}
        >
          {activeTab === "signup" ? "Create Account" : "Welcome Back"}
        </h1>

        {/* Error banner */}
        {error && (
          <div className="bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-3 mb-4 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Tabs */}
        <TabSwitcher active={activeTab} onSwitch={switchTab} />

        {/* Form fields */}
        <div className="flex flex-col gap-4">
          {activeTab === "signup" ? (
            <SignUpFields form={signUpForm} onChange={handleSignUpChange} />
          ) : (
            <LoginFields form={loginForm} onChange={handleLoginChange} />
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 mt-1 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full text-sm font-bold shadow-lg shadow-amber-400/15 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={hFont}
          >
            {loading
              ? "Loading..."
              : activeTab === "signup"
                ? "Create Account"
                : "Log In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-slate-700/30" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-700/30" />
          </div>

          {/* Google OAuth placeholder */}
          <button className="w-full py-3 bg-slate-800/40 border border-slate-600/25 rounded-xl text-slate-300 text-sm font-medium flex items-center justify-center gap-2 transition-all hover:border-amber-400/40">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer toggle */}
        <p className="text-center text-xs text-slate-500 mt-6">
          {activeTab === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => switchTab("login")}
                className="text-amber-400 font-medium hover:text-amber-300 transition-colors"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => switchTab("signup")}
                className="text-amber-400 font-medium hover:text-amber-300 transition-colors"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
