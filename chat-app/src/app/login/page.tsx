import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_82%_12%,#d9edda_0,transparent_32%)] p-6">
      <div className="w-[min(100%,440px)] rounded-[22px] border border-line bg-white/85 p-11.5 shadow-[0_24px_60px_#294a3714] max-sm:px-5.5 max-sm:py-7.5">
        <a
          className="text-[1.4rem] font-extrabold tracking-[-.08em]"
          href="https://relay-landing-page-seven.vercel.app"
          target="_blank"
          rel="noreferrer"
        >
          relay<span className="text-relay-coral">.</span>
        </a>
        <p className="mb-2.5 mt-7.5 text-[.7rem] font-extrabold uppercase tracking-[.14em] text-relay-deep">
          A quieter way to keep in touch
        </p>
        <h1 className="mb-2.5 text-[2.8rem] tracking-[-.08em]">
          Welcome back.
        </h1>
        <p className="mb-7.5 leading-[1.6] text-muted">
          Sign in with your phone number and start a conversation.
        </p>
        <LoginForm />
        <a
          className="mt-6.5 block text-center text-[.71rem] text-muted hover:text-ink"
          href="https://relay-landing-page-seven.vercel.app"
          target="_blank"
          rel="noreferrer"
        >
          ← Back to home
        </a>
      </div>
    </main>
  );
}
