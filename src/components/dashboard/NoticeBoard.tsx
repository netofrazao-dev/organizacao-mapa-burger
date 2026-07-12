"use client";

import * as React from "react";
import { Pin, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MOCK_NOTICES } from "@/lib/mock-notices";
import { formatRelativeTime } from "@/lib/format-time";

/**
 * NoticeBoard (Mural de Recados)
 * ------------------------------
 * Mostra os avisos recentes da gerência na home do dashboard —
 * fixados (`pinned`) sempre no topo, seguidos pelos mais recentes.
 * Pensado pra ser lido em poucos segundos ao abrir o painel no
 * início do turno, não para navegação profunda (por isso mostra só
 * os 3 primeiros e não pagina).
 */
export function NoticeBoard() {
  const sortedNotices = React.useMemo(() => {
    return [...MOCK_NOTICES]
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 3);
  }, []);

  return (
    <Card padding="md">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          <Megaphone className="size-4" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Mural de recados</h2>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {sortedNotices.map((notice) => (
          <div key={notice.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-2">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                {notice.pinned && (
                  <Pin className="size-3.5 shrink-0 fill-brand-500 text-brand-500" />
                )}
                {notice.title}
              </p>
              <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                {formatRelativeTime(notice.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{notice.content}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">— {notice.authorName}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
