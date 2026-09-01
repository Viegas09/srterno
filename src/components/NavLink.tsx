"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm transition ${
        active ? "bg-leather text-gold-soft" : "text-paper/70 hover:bg-leather/60 hover:text-paper"
      }`}
    >
      {children}
    </Link>
  );
}
