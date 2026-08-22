The "Eclatique in Motion" reels are hosted on Cloudinary (not committed to the
repo — video files are too large for git).

The URLs are configured in src/components/reels-section.tsx. They are served
as-uploaded (already HandBrake-optimized, vertical 9:16, ~7-14 MB each) with NO
Cloudinary resize/quality transform — those transforms cropped the vertical clips
to landscape and re-compressed them, so avoid adding w_/q_auto to these URLs.

To swap a reel: re-upload to Cloudinary and update the matching URL in
reels-section.tsx.
