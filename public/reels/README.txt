The "Eclatique in Motion" reels are hosted on Cloudinary (not committed to the
repo — video files are too large for git).

The URLs are configured in src/components/reels-section.tsx, delivered with the
f_auto,q_auto,w_800 transformation so browsers receive a small, optimized stream
rather than the original multi-hundred-MB uploads.

To swap a reel: re-upload to Cloudinary and update the matching URL in
reels-section.tsx.
