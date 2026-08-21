import { ReactNode } from "react";

export const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-relay-deep px-4.5 text-[.84rem] font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#214f37]";
export const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#edf2ec] px-4.5 text-[.84rem] font-bold text-relay-deep transition duration-200 hover:-translate-y-0.5 hover:bg-[#dfeade]";
export const inputClass =
  "h-11.5 rounded-[10px] border border-line bg-white px-3.25 text-ink outline-none focus:border-relay-deep focus:ring-4 focus:ring-relay-green/25";
export const eyebrowClass =
  "mb-2.5 text-[.7rem] font-extrabold uppercase tracking-[.14em] text-relay-deep";

export function Avatar({
  name,
  small = false,
}: {
  name: string;
  small?: boolean;
}) {
  return (
    <span
      className={`${
        small ? "size-8.5 text-[.68rem]" : "size-9.5 text-[.82rem]"
      } inline-grid shrink-0 place-items-center rounded-full bg-relay-green font-extrabold text-relay-deep`}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function IconButton({
  children,
  ...props
}: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="grid size-8.5 place-items-center rounded-full border border-line bg-transparent text-muted hover:border-ink hover:text-ink"
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-[.75rem] font-bold">
      <span>{label}</span>
      {children}
    </label>
  );
}
