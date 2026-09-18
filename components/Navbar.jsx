"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Shield } from "lucide-react";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/events/utsaah-3", label: "UTSAAH 3.0" },
  { href: "/art-gathering", label: "Art Gathering" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Hide public navbar inside admin portal pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-ink/95 backdrop-blur-md border-b border-sand/20 shadow-lg py-1"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-2"
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
              aria-label="The Third Space — Home"
            >
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 overflow-hidden rounded-sm border border-cream/30 shadow-md">
                <Image
                  src="/brand/logo.jpeg"
                  alt="The Third Space logo"
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm lg:text-base tracking-wide text-cream group-hover:text-lime transition-colors drop-shadow-sm">
                  THE THIRD SPACE
                </span>
                <span className="text-[10px] text-cream/70 tracking-widest uppercase">
                  MLRIT Community
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm tracking-wide font-medium transition-colors hover:text-lime ${
                      isActive
                        ? "text-lime font-semibold"
                        : "text-cream/90 hover:text-lime drop-shadow-sm"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Admin login direct link */}
              <Link
                href="/admin/login"
                className="text-xs tracking-wider text-cream/70 hover:text-lime flex items-center gap-1.5 transition-colors px-2.5 py-1.5 rounded-sm border border-cream/20 hover:border-lime/40 bg-black/30 backdrop-blur-sm"
                title="Admin Portal"
              >
                <Shield size={13} aria-hidden="true" />
                <span>Admin</span>
              </Link>

              {/* Register CTA */}
              <Link
                href="/register"
                className="px-5 py-2.5 bg-lime text-forest font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-lime/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(200,228,74,0.3)]"
              >
                Register Now
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-cream hover:text-lime transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-lime"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isOpen && (
          <div className="md:hidden bg-ink/95 backdrop-blur-lg border-b border-sand/30 px-4 pt-2 pb-6 space-y-4 shadow-2xl">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 text-base font-medium transition-colors ${
                    isActive ? "text-lime font-bold" : "text-cream hover:text-lime"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-cream/20 flex items-center justify-between">
              <Link
                href="/admin/login"
                className="text-xs text-cream/70 hover:text-lime flex items-center gap-1.5 py-2"
              >
                <Shield size={14} />
                <span>Admin Portal</span>
              </Link>
              <Link
                href="/register"
                className="inline-block px-5 py-2.5 bg-lime text-forest text-xs font-bold tracking-wider uppercase rounded-sm"
              >
                Register Now
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
