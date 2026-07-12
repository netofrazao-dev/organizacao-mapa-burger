"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  TrendingUp,
  AlertOctagon,
  PackageX,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useSession } from "@/components/providers/SessionProvider";
import { MOCK_PRODUCTS, MOCK_PRODUCTION_LOGS } from "@/lib/mock-production";
import { MOCK_OCCURRENCES } from "@/lib/mock-occurrences";
import { MOCK_INVENTORY, getStockStatus } from "@/lib/mock-inventory";

/**
 * Dashboard Executivo — visão exclusiva do Gerente.
 *
 * Reaproveita os mesmos dados mock das páginas operacionais (Produção,
 * Ocorrências, Estoque), só que agregados em métricas de leitura rápida.
 * Quando a API real existir, essas agregações devem migrar para o
 * backend (endpoints dedicados ou views no banco) — calcular tudo no
 * cliente deixa de fazer sentido assim que o volume de dados crescer.
 */
function computeProductionProgress() {
  const perProduct = MOCK_PRODUCTS.map((product) => {
    const produced = MOCK_PRODUCTION_LOGS.filter((l) => l.productId === product.id).reduce(
      (sum, l) => sum + l.quantityProduced,
      0
    );
    return Math.min(100, Math.round((produced / product.dailyTarget) * 100));
  });

  return Math.round(perProduct.reduce((sum, p) => sum + p, 0) / perProduct.length);
}

export default function ManagerPage() {
  const { user } = useSession();

  const isManager = user.role.slug === "gerente";

  const productionProgress = React.useMemo(() => computeProductionProgress(), []);

  const criticalOccurrences = React.useMemo(
    () => MOCK_OCCURRENCES.filter((o) => o.severity === "CRITICAL" && o.status !== "RESOLVED"),
    []
  );

  const openOccurrences = React.useMemo(
    () => MOCK_OCCURRENCES.filter((o) => o.status !== "RESOLVED"),
    []
  );

  const stockAlerts = React.useMemo(
    () => MOCK_INVENTORY.filter((i) => getStockStatus(i) !== "normal"),
    []
  );

  const criticalStock = stockAlerts.filter((i) => getStockStatus(i) === "critico");

  if (!isManager) {
    return (
      <div className="mx-auto max-w-md pt-16 text-center">
        <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-lg bg-danger-subtle text-danger">
          <ShieldAlert className="size-5" />
        </div>
        <h1 className="text-lg font-semibold text-foreground">Acesso restrito</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Esta visão executiva é exclusiva do cargo de Gerente. Fale com o gerente do turno se
          precisar desses dados.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-block text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Visão executiva</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Panorama do turno atual em três frentes: produção, ocorrências e estoque.
        </p>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card padding="md">
          <div className="mb-3 flex size-9 items-center justify-center rounded-md bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            <TrendingUp className="size-4.5" />
          </div>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {productionProgress}%
          </p>
          <p className="text-sm text-muted-foreground">Produção concluída hoje</p>
        </Card>

        <Card padding="md">
          <div className="mb-3 flex size-9 items-center justify-center rounded-md bg-danger-subtle text-danger">
            <AlertOctagon className="size-4.5" />
          </div>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {criticalOccurrences.length}
          </p>
          <p className="text-sm text-muted-foreground">Ocorrências críticas abertas</p>
        </Card>

        <Card padding="md">
          <div className="mb-3 flex size-9 items-center justify-center rounded-md bg-warning-subtle text-warning">
            <PackageX className="size-4.5" />
          </div>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {stockAlerts.length}
          </p>
          <p className="text-sm text-muted-foreground">Alertas de estoque</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Ocorrências abertas */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Ocorrências em aberto</h2>
            <Link
              href="/dashboard/occurrences"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Ver todas <ArrowUpRight className="size-3" />
            </Link>
          </div>

          <Card padding="none">
            {openOccurrences.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">Nenhuma ocorrência em aberto.</p>
            )}
            <div className="divide-y divide-border">
              {openOccurrences.slice(0, 5).map((occ) => (
                <div key={occ.id} className="flex items-center justify-between gap-3 p-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{occ.title}</p>
                    <p className="text-xs text-muted-foreground">{occ.reportedByName}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      occ.severity === "CRITICAL"
                        ? "bg-danger-subtle text-danger"
                        : occ.severity === "HIGH"
                          ? "bg-warning-subtle text-warning"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {occ.severity === "CRITICAL"
                      ? "Crítica"
                      : occ.severity === "HIGH"
                        ? "Alta"
                        : occ.severity === "MEDIUM"
                          ? "Média"
                          : "Baixa"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Estoque crítico */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Itens em nível crítico</h2>
            <Link
              href="/dashboard/inventory"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Ver estoque <ArrowUpRight className="size-3" />
            </Link>
          </div>

          <Card padding="none">
            {criticalStock.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                Nenhum item em nível crítico agora.
              </p>
            )}
            <div className="divide-y divide-border">
              {criticalStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 p-3.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-danger">
                    {item.currentQty} / {item.minQty} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
