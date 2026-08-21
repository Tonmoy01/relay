"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, login } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanPhone = phone.trim();
    const cleanName = name.trim();

    if (!cleanName || !cleanPhone) {
      setError("Please enter both your name and phone number.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const result = await login(cleanPhone, cleanName);
      saveSession(result.token, result.user);
      router.push("/chat");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.message
          : "We could not log you in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-xs font-bold">
        <span>Your name</span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ada Lovelace"
          autoComplete="name"
          className="h-12 rounded-[10px] border border-line bg-white px-3.25 text-ink outline-none focus:border-relay-deep focus:ring-4 focus:ring-relay-green/25"
        />
      </label>
      <label className="grid gap-2 text-xs font-bold">
        <span>Phone number</span>
        <input
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+1 555 123 4567"
          autoComplete="tel"
          inputMode="tel"
          className="h-12 rounded-[10px] border border-line bg-white px-3.25 text-ink outline-none focus:border-relay-deep focus:ring-4 focus:ring-relay-green/25"
        />
      </label>
      {error ? (
        <p
          className="m-0 text-[.74rem] leading-normal text-[#a43b2c]"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <button
        className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-full bg-relay-deep px-4.5 text-[.84rem] font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#214f37]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in…" : "Continue to chat"}
      </button>
      <p className="m-0 text-center text-[.7rem] leading-normal text-muted">
        New phone numbers are registered automatically.
      </p>
    </form>
  );
}
