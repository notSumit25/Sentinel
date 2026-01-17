"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
    href: string;
    icon: React.ReactNode;
    label: string;
}

export function SidebarItem({ href, icon, label }: Props) {
    const pathname = usePathname();
    const active = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition outline-none
        ${
                active
                    ? "bg-primary text-white shadow"
                    : "text-foreground hover:bg-surface"
            } focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background`}
        >
            <span className="text-lg">{icon}</span>
            {label}
        </Link>
    );
}
