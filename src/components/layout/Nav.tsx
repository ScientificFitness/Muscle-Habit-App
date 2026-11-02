"use client";

import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/cn";
import {
  Beaker,
  ClipboardList,
  Dumbbell,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Ruler,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/programs", label: "Programs", icon: ClipboardList },
  { href: "/workout", label: "Train", icon: Dumbbell },
  { href: "/numbers", label: "My Numbers", icon: Ruler },
  { href: "/lab", label: "Habit Lab", icon: Beaker },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useApp();
  const shopUrl = state.settings.shopUrl;

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-[var(--navy)]/10 md:bg-white/70 md:backdrop-blur-sm">
      <div className="flex items-center gap-2 px-4 py-5">
        <Link href="/dashboard" className="block">
          <Image
            src="/muscle-habit-logo.png"
            alt="Muscle Habit"
            width={168}
            height={30}
            priority
            className="h-8 w-auto"
          />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 pb-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                active
                  ? "bg-[var(--navy)] text-white"
                  : "text-[var(--navy)] hover:bg-[var(--navy)]/5"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
        <a
          href={shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--mid-slate)] transition-colors duration-200 hover:bg-[var(--navy)]/5 hover:text-[var(--navy)]"
        >
          <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden />
          Shop
        </a>
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const mobile = links.filter((l) =>
    ["/dashboard", "/programs", "/workout", "/numbers", "/lab"].includes(l.href)
  );

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--navy)]/10 bg-white/95 backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {mobile.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors duration-200",
                  active ? "text-[var(--orange)]" : "text-[var(--mid-slate)]"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label === "My Numbers" ? "Numbers" : label === "Habit Lab" ? "Lab" : label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-[var(--navy)]/10 bg-white/70 px-4 py-3 backdrop-blur md:hidden">
      <Link href="/dashboard">
        <Image
          src="/muscle-habit-logo.png"
          alt="Muscle Habit"
          width={148}
          height={27}
          priority
          className="h-7 w-auto"
        />
      </Link>
      <Link
        href="/settings"
        className="rounded-md p-2 text-[var(--navy)] hover:bg-[var(--navy)]/5"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" />
      </Link>
    </header>
  );
}
