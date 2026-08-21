import Link from "next/link";

const previewMessages = [
  {
    name: "Mara",
    text: "The quiet corner is free.",
    time: "09:41",
    mine: false,
  },
  {
    name: "You",
    text: "Perfect. I’ll bring the coffee.",
    time: "09:42",
    mine: true,
  },
  { name: "Mara", text: "Then it’s a plan.", time: "09:43", mine: false },
];

const pageWidth =
  "mx-auto w-[min(1160px,calc(100%-48px))] max-md:w-[calc(100%-32px)]";
const button =
  "inline-flex min-h-11 items-center justify-center gap-3 rounded-full px-4.5 text-[.84rem] font-bold transition duration-200 hover:-translate-y-0.5";
const eyebrow =
  "mb-2.5 text-[.7rem] font-extrabold uppercase tracking-[.14em] text-relay-deep";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-paper">
      <nav
        className={`${pageWidth} flex items-center justify-between py-7 max-md:py-5`}
      >
        <Link
          className="text-[1.4rem] font-extrabold tracking-[-.08em]"
          href="/"
        >
          relay<span className="text-relay-coral">.</span>
        </Link>
        <div className="flex items-center gap-7 text-[.82rem] text-muted">
          <a className="hover:text-ink max-md:hidden" href="#how-it-works">
            How it works
          </a>
          <Link className="border-b border-ink pb-1 text-ink" href="/login">
            Open chat ↗
          </Link>
        </div>
      </nav>
      <section
        className={`${pageWidth} grid min-h-160 grid-cols-[.92fr_1.08fr] items-center gap-12.5 py-17.5 pb-25 max-md:block max-md:min-h-0 max-md:py-17.5 max-md:pb-22.5`}
      >
        <div>
          <p className={eyebrow}>Conversations, kept close</p>
          <h1 className="m-0 max-w-147.5 text-[clamp(3.2rem,6.5vw,6.4rem)] leading-[.92] tracking-[-.085em] max-md:text-[clamp(3.2rem,15vw,5.3rem)]">
            Make room for the messages that matter.
          </h1>
          <p className="my-7 max-w-105 text-[1.02rem] leading-[1.7] text-muted">
            Relay is a small, focused chat space for direct conversations and
            the groups that keep projects moving.
          </p>
          <div className="flex items-center gap-5.5">
            <Link
              className={`${button} bg-relay-deep text-white hover:bg-[#214f37]`}
              href="/login"
            >
              Start a conversation <span>→</span>
            </Link>
            <a
              className="text-[.82rem] font-bold text-relay-deep hover:text-ink"
              href="#how-it-works"
            >
              See how it works ↓
            </a>
          </div>
          <div className="mt-17 flex items-center gap-3 text-[.72rem] leading-[1.45] text-muted">
            <span className="flex pl-2">
              <span className="-ml-2 grid size-7.25 place-items-center rounded-full border-2 border-paper bg-relay-green text-[.65rem] font-extrabold">
                R
              </span>
              <span className="-ml-2 grid size-7.25 place-items-center rounded-full border-2 border-paper bg-relay-warm text-[.65rem] font-extrabold">
                M
              </span>
              <span className="-ml-2 grid size-7.25 place-items-center rounded-full border-2 border-paper bg-relay-coral text-[.65rem] font-extrabold">
                J
              </span>
            </span>
            <span>
              Simple by design.
              <br />
              <strong className="text-ink">Ready when you are.</strong>
            </span>
          </div>
        </div>
        <div
          className="relative min-h-120 max-md:mt-12 max-md:min-h-105"
          aria-label="Chat preview"
        >
          <div className="absolute right-0 top-3 size-97.5 rounded-full border border-[#cfdccf] max-md:size-75" />
          <div className="absolute bottom-2 right-[7%] size-56.25 rounded-full border border-[#edcdb9]" />
          <div className="absolute right-[8%] top-14 z-1 w-[min(430px,86%)] rotate-2 overflow-hidden rounded-2xl border border-[#cfd8d0] bg-white shadow-[24px_30px_80px_#294a371c] max-md:right-px">
            <div className="flex items-center justify-between border-b border-line px-4.25 py-3.25 text-[.63rem] text-muted">
              <span className="flex gap-1">
                <i className="size-1.5 rounded-full bg-relay-coral" />
                <i className="size-1.5 rounded-full bg-relay-warm" />
                <i className="size-1.5 rounded-full bg-relay-green" />
              </span>
              <span>quiet / corner</span>
              <span className="text-relay-deep">● live</span>
            </div>
            <div className="bg-[linear-gradient(145deg,#fff_35%,#f5faf4)] p-5.75">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9.5 place-items-center rounded-full bg-relay-green text-[.82rem] font-extrabold text-relay-deep">
                  M
                </span>
                <div>
                  <strong className="block text-[.8rem]">Mara Ellison</strong>
                  <small className="mt-0.75 block text-[.65rem] text-relay-deep">
                    online now
                  </small>
                </div>
                <span className="ml-auto tracking-[.12em] text-muted">•••</span>
              </div>
              <div className="my-8.5 mb-3.75 text-center text-[.62rem] text-muted">
                Today · 09:41
              </div>
              <div>
                {previewMessages.map((message) => (
                  <div
                    className={`my-3.5 ${
                      message.mine ? "flex flex-col items-end" : ""
                    }`}
                    key={message.text}
                  >
                    <small className="mb-1 ml-1 block text-[.6rem] text-muted">
                      {message.name}
                    </small>
                    <div
                      className={`flex w-fit max-w-[88%] items-end gap-2.5 px-3.25 py-2.75 text-[.73rem] leading-[1.35] ${
                        message.mine
                          ? "rounded-[14px_4px_14px_14px] bg-relay-deep text-white"
                          : "rounded-[4px_14px_14px_14px] bg-[#eef3ef] text-[#385541]"
                      }`}
                    >
                      <span>{message.text}</span>
                      <time
                        className={`text-[.57rem] ${
                          message.mine ? "text-[#c8ebd2]" : "text-[#809188]"
                        }`}
                      >
                        {message.time}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between rounded-[10px] border border-line px-3 py-2.5 text-[.67rem] text-[#9ba8a0]">
                <span>Write a message…</span>
                <b className="grid size-6 place-items-center rounded-[7px] bg-relay-deep text-white">
                  ↑
                </b>
              </div>
            </div>
          </div>
          <span className="absolute left-[3%] top-4.75 z-2 text-[.65rem] leading-[1.35] tracking-wide text-relay-deep">
            real-time
            <br />
            <strong className="text-ink">without noise</strong>
          </span>
          <span className="absolute bottom-5 right-[4%] z-2 text-[.65rem] text-muted">
            01 / 03
          </span>
        </div>
      </section>
      <section
        className={`${pageWidth} grid grid-cols-3 gap-12 border-t border-line py-18 pb-25 max-md:grid-cols-1 max-md:gap-8.75 max-md:py-13.75 max-md:pb-18.75`}
        id="how-it-works"
      >
        {[
          [
            "01",
            "Find your people.",
            "Search by name or phone number and start a conversation in a few seconds.",
          ],
          [
            "02",
            "Keep the thread.",
            "Direct messages and small groups stay together, with history always within reach.",
          ],
          [
            "03",
            "Stay in the moment.",
            "New messages arrive live, while your place is protected when you are reading back.",
          ],
        ].map(([number, title, copy]) => (
          <div key={number}>
            <span className="mb-3 inline-block text-[.7rem] font-extrabold text-relay-coral md:mb-7.5">
              {number}
            </span>
            <h2 className="m-0 text-[1.55rem] tracking-[-.06em]">{title}</h2>
            <p className="mt-3 max-w-61.25 text-[.82rem] leading-[1.65] text-muted">
              {copy}
            </p>
          </div>
        ))}
      </section>
      <section
        className={`${pageWidth} py-27.5 pb-32.5 text-center max-md:py-20 max-md:pb-22.5`}
      >
        <p className={eyebrow}>Your next message is waiting</p>
        <h2 className="m-0 mb-7.5 text-[clamp(2.5rem,5vw,5rem)] leading-[.98] tracking-[-.08em]">
          A little less inbox.
          <br />
          <em className="font-serif font-normal text-relay-deep">
            A lot more conversation.
          </em>
        </h2>
        <Link className={`${button} bg-ink text-white`} href="/login">
          Open Relay <span>↗</span>
        </Link>
      </section>
      <footer
        className={`${pageWidth} flex items-center justify-between border-t border-line py-6 text-[.68rem] text-muted max-md:flex-wrap max-md:gap-3`}
      >
        <span className="text-[1.4rem] font-extrabold tracking-[-.08em]">
          relay<span className="text-relay-coral">.</span>
        </span>
        <span>Direct + group chat, made simple.</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
