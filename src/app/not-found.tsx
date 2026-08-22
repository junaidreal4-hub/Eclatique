import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
      <p className="label text-[11px] text-faint">Error 404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-4 text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="label mt-8 inline-block bg-accent px-8 py-3 text-[11px] text-paper"
      >
        Back to Home
      </Link>
    </div>
  );
}
