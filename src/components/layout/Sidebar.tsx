"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  ChefHat,
  Package,
  AlertTriangle,
  Users,
  LineChart,
  UtensilsCrossed,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/components/providers/SessionProvider";
import type { RoleSlug } from "@/types/auth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  /** Cargos que enxergam este item. Ausente = visível para todos. */
  roles?: RoleSlug[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "/dashboard", icon: LayoutDashboard },
  { label: "Checklist", href: "/dashboard/tasks", icon: ClipboardList },
  {
    label: "Produção",
    href: "/dashboard/production",
    icon: ChefHat,
    roles: ["gerente", "cozinheira"],
  },
  {
    label: "Estoque",
    href: "/dashboard/inventory",
    icon: Package,
    roles: ["gerente", "estoquista"],
  },
  { label: "Ocorrências", href: "/dashboard/occurrences", icon: AlertTriangle },
  {
    label: "Visão executiva",
    href: "/dashboard/manager",
    icon: LineChart,
    roles: ["gerente"],
  },
  { label: "Equipe", href: "/dashboard/equipe", icon: Users, roles: ["gerente"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useSession();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user.role.slug)
  );

  return (
    <>
      {/* Botão de abrir menu — visível só no mobile */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-3 top-3 z-30 flex size-9 items-center justify-center rounded-md border border-border bg-surface shadow-xs md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="size-4.5" />
      </button>

      {/* Overlay mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-border bg-surface",
          "transition-transform duration-150 ease-out md:static md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-brand-500 text-white">
              <UtensilsCrossed className="size-4" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold text-foreground">Mapa Burger</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted md:hidden"
            aria-label="Fechar menu"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
          {visibleItems.map((item) => {
            const isActive =
              item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
            Cargo atual: <span className="font-medium text-foreground">{user.role.name}</span>
          </p>
        </div>
      </aside>
    </>
  );
}
