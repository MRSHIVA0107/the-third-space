import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md space-y-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-forest">
          Error 404
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-ink">
          This space doesn&apos;t exist.
        </h1>
        <p className="text-sm text-muted font-light leading-relaxed">
          The page you are looking for has either moved or was not created yet.
          Take a breath and head back home.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="px-6 py-3 bg-forest text-cream font-medium text-xs uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-colors inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
