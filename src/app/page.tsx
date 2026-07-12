"use client";

import * as React from "react";
import Link from "next/link";
import {
  ClipboardList,
  ChefHat,
  Package,
  AlertTriangle,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { NoticeBoard } from "@/components/dashboard/NoticeBoard";
import { useSession } from "@/components/providers/SessionProvider";
import type { RoleSlug } from "@/types/auth";

interface QuickAccessItem {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  roles?: RoleSlug[];
}

const QUICK_ACCESS: QuickAccessItem[] = [
  {
    title: "Checklist do turno",
    description: "Abertura, fechamento e rotinas do dia.",
    href: "/dashboard/tasks",
    icon: ClipboardList,
  },
  {
    title: "Produção",
    description: "Fila de itens em preparo na cozinha.",
    href: "/dashboard/production",
    icon: ChefHat,
    roles: ["gerente", "cozinheira"],
  },
  {
    title: "Estoque",
    description: "Nível de insumos e alertas de reposição.",
    href: "/dashboard/inventory",
    icon: Package,
    roles: ["gerente", "estoquista"],
  },
  {
    title: "Ocorrências",
    description: "Registrar ou consultar problemas do turno.",
    href: "/dashboard/occurrences",
    icon: AlertTriangle,
  },
  {
    title: "Equipe",
    description: "Escala, cargos e setores dos funcionários.",
    href: "/dashboard/equipe",
    icon: Users,
    roles: ["gerente"],
  },
];

function getGreeting(hour: number) {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const { user } = useSession();
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const firstName = user.name.split(" ")[0];

  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(now);

  const timeLabel = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  const items = QUICK_ACCESS.filter((item) => !item.roles || item.roles.includes(user.role.slug));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {getGreeting(now.getHours())}, {firstName}
          </h1>
          <p className="mt-1 text-sm capitalize text-muted-foreground">{dateLabel}</p>
        </div>

        <div className="rounded-md border border-border bg-surface px-4 py-2.5 text-right shadow-xs">
          <p className="font-mono text-xl font-semibold tabular-nums text-foreground">
            {timeLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Acesso rápido</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="block">
                  <Card variant="interactive" padding="md">
                    <CardHeader>
                      <div className="flex size-9 items-center justify-center rounded-md bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                        <Icon className="size-4.5" aria-hidden="true" />
                      </div>
                      <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true" />
                    </CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Comunicação</h2>
          <NoticeBoard />
        </div>
      </div>
    </div>
  );
}
