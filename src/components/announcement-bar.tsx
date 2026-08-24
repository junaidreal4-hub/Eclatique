const MESSAGES = [
  "Free Delivery Across India",
  "Easy 3-Day Returns",
  "Secure Prepaid Checkout",
  "Choose the Unordinary",
];

// Repeat the set enough times that one track is wider than any viewport, so the
// two tracks form a continuous loop with no empty gap before it repeats.
const LOOP = Array.from({ length: 4 }).flatMap(() => MESSAGES);

function Track({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {LOOP.map((m, i) => (
        <span key={`${m}-${i}`} className="flex items-center">
          <span className="label mx-6 text-[11px] whitespace-nowrap">{m}</span>
          <span className="text-paper/40">&#183;</span>
        </span>
      ))}
    </div>
  );
}

export function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-accent text-paper">
      <div className="flex h-9 items-center">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <Track />
          <Track ariaHidden />
        </div>
      </div>
    </div>
  );
}
