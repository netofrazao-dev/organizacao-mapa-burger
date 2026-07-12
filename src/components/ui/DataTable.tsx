"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  /** Esconde a coluna em telas pequenas — usar para colunas secundárias. */
  hideOnMobile?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  emptyMessage?: string;
}

const ALIGN_CLASSES: Record<NonNullable<DataTableColumn<unknown>["align"]>, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

/**
 * DataTable
 * ---------
 * Tabela base para listagens densas (produção, estoque, ocorrências).
 * Header sticky, linhas com hover sutil, sem zebra (mais Linear/Notion
 * do que planilha) — a separação entre linhas vem de uma borda fina.
 */
export function DataTable<T>({ columns, data, getRowId, emptyMessage }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "whitespace-nowrap px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                    ALIGN_CLASSES[col.align ?? "left"],
                    col.hideOnMobile && "hidden sm:table-cell"
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage ?? "Nenhum registro encontrado."}
                </td>
              </tr>
            )}

            {data.map((row) => (
              <tr
                key={getRowId(row)}
                className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/40"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "whitespace-nowrap px-4 py-3 text-foreground",
                      ALIGN_CLASSES[col.align ?? "left"],
                      col.hideOnMobile && "hidden sm:table-cell",
                      col.className
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
