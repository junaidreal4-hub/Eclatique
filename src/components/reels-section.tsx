import { getReels } from "@/lib/reels";
import { ReelsGrid } from "./reels-grid";

export async function ReelsSection() {
  const reels = await getReels();
  if (reels.length === 0) return null;

  return (
    <section className="mx-auto mt-16 max-w-[1400px] px-4 py-6 sm:px-6">
      <div className="mb-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <span className="label text-[11px] text-faint">On Reels</span>
          <span className="h-px w-8 bg-accent" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Eclatique in Motion
        </h2>
        <p className="mt-2 text-sm text-muted">
          Real looks, styled by our community.
        </p>
      </div>

      <ReelsGrid urls={reels.map((r) => r.videoUrl)} />
    </section>
  );
}
