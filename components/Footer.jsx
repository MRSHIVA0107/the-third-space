import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-cream/80 border-t border-sand/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-sm overflow-hidden border border-cream/20">
              <Image
                src="/brand/logo.jpeg"
                alt="The Third Space Logo"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <span className="font-display text-lg text-cream tracking-wide">
              THE THIRD SPACE
            </span>
          </div>
          <p className="text-sm text-cream/60 max-w-sm leading-relaxed">
            A student-led community space at MLRIT for conversations, mental health,
            creative expression, and authentic connection.
          </p>
          <p className="font-display italic text-sm text-lime/90 tracking-wide">
            Think. Create. Connect. Belong.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-cream/40 font-semibold">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-lime transition-colors">
                About The Space
              </Link>
            </li>
            <li>
              <Link href="/events/utsaah-3" className="hover:text-lime transition-colors">
                UTSAAH 3.0 Campaign
              </Link>
            </li>
            <li>
              <Link href="/art-gathering" className="hover:text-lime transition-colors">
                Metamorphosis Gallery
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-lime transition-colors font-medium text-cream">
                Register for Event
              </Link>
            </li>
          </ul>
        </div>

        {/* Next Event & Admin */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-cream/40 font-semibold">
            Next Event
          </p>
          <div className="p-3 bg-cream/5 border border-cream/10 rounded-sm">
            <p className="font-display text-sm text-cream">UTSAAH 3.0</p>
            <p className="text-xs text-cream/60 mt-1">19 September 2026</p>
            <p className="text-xs text-cream/50">MLRIT Auditorium</p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-cream/40 hover:text-lime transition-colors"
            >
              <Shield size={13} />
              <span>Admin Portal Access</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/40 gap-4">
        <p>© 2026 The Third Space — MLRIT. All rights reserved.</p>
        <p>In collaboration with Psychologs Magazine.</p>
      </div>
    </footer>
  );
}
