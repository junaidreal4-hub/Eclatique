import { getReels } from "@/lib/reels";
import {
  addReelAction,
  deleteReelAction,
  updateReelOrderAction,
} from "@/app/admin/actions";

export default async function AdminReelsPage() {
  const reels = await getReels();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Reels</h1>
      <p className="mt-1 text-sm text-muted">
        The videos in the &ldquo;Eclatique in Motion&rdquo; section on the homepage.
      </p>

      <form
        action={addReelAction}
        className="mt-6 flex flex-col gap-3 border border-line bg-paper p-5 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="label mb-2 block text-[10px] text-faint">
            Cloudinary Video URL
          </label>
          <input
            name="videoUrl"
            required
            placeholder="https://res.cloudinary.com/.../reel.mp4"
            className="w-full border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </div>
        <button
          type="submit"
          className="label bg-accent px-6 py-2.5 text-[11px] text-paper hover:opacity-90"
        >
          Add Reel
        </button>
      </form>
      <p className="mt-2 text-xs text-faint">
        Upload the video to Cloudinary, then paste its direct link here. Videos should be
        vertical (9:16) MP4.
      </p>

      {reels.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">No reels yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {reels.map((r) => (
            <div key={r.id} className="border border-line bg-paper">
              <div className="relative aspect-[9/16] overflow-hidden bg-ink">
                <video
                  src={r.videoUrl}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="space-y-3 p-3">
                <p className="truncate text-[10px] text-faint" title={r.videoUrl}>
                  {r.videoUrl.split("/").pop()}
                </p>
                <div className="flex items-center gap-2">
                  <form action={updateReelOrderAction} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      name="sortOrder"
                      type="number"
                      defaultValue={r.sortOrder}
                      className="w-14 border border-line bg-transparent px-2 py-1 text-center text-sm outline-none focus:border-ink"
                      aria-label="Display order"
                    />
                    <button
                      type="submit"
                      className="label border border-line px-2 py-1 text-[10px] hover:bg-subtle"
                    >
                      Order
                    </button>
                  </form>
                  <form action={deleteReelAction} className="ml-auto">
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="text-xs font-medium text-sale underline underline-offset-2 hover:opacity-70"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
