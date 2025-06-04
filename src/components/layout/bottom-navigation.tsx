
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Siren, Mic, BookOpen, Users } from "lucide-react"; // Changed ShieldAlert back to Siren
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/emergency-alert", label: "SOS", icon: Siren }, // Changed ShieldAlert back to Siren
  { href: "/ai-assistant", label: "Assistant", icon: Mic },
  { href: "/first-aid", label: "Aid Guide", icon: BookOpen },
  { href: "/help-network", label: "HelpNet", icon: Users },
];

export function BottomNavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-md">
      <div className="mx-auto grid h-16 max-w-md items-center justify-around" style={{ gridTemplateColumns: `repeat(${navItems.length}, 1fr)`}}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-1 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "")} />
              <span className="mt-0 leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
