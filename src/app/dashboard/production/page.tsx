"use client";

import * as React from "react";
import { Plus, CheckCircle2, AlertTriangle, MinusCircle } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProductionForm, type ProductionFormValues } from "@/components/forms/ProductionForm";
import { useSession } from "@/components/providers/SessionProvider";
import {
  MOCK_PRODUCTS,
  MOCK_PRODUCTION_LOGS,
  type ProductionLogData,
} from "@/lib/mock-production";

interface ProductRow {
  productId: string;
  name: string;
  category: string;
  unit: string;
  dailyTarget: number;
  produced: number;
  lost: number;
  progress: number; // 0–100+
  lastResponsible: string | null;
  lastUpdate: string | null;
}

function buildRows(logs: ProductionLogData[]): ProductRow[] {
  return MOCK_PRODUCTS.map((product) => {
    const productLogs = logs
      .filter((l) => l.productId === product.id)
      .sort((a, b) => new Date(b.producedAt).getTime() - new Date(a.producedAt).getTime());

    const produced = productLogs.reduce((sum, l) => sum + l.quantityProduced, 0);
    const lost = productLogs.reduce((sum, l) => sum + l.quantityLost, 0);

    return {
      productId: product.id,
      name: product.name,
      category: product.category,
      unit: product.unit,
      dailyTarget: product.dailyTarget,
      produced,
      lost,
      progress: Math.round((produced / product.dailyTarget) * 100),
      lastResponsible: productLogs[0]?.userName ?? null,
      lastUpdate: productLogs[0]?.producedAt ?? null,
    };
  });
}

function StatusBadge({ progress }: { progress: number }) {
  if (progress >= 100) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success-subtle px-2 py-0.5 text-xs font-medium text-success">
        <CheckCircle2 className="size-3.5" /> Meta batida
      </span>
    );
  }
  if (progress > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning-subtle px-2 py-0.5 text-xs font-medium text-warning">
        <AlertTriangle className="size-3.5" /> Em produção
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <MinusCircle className="size-3.5" /> Não iniciado
    </span>
  );
}

export default function ProductionPage() {
  const { user } = useSession();
  const [logs, setLogs] = React.useState<ProductionLogData[]>(MOCK_PRODUCTION_LOGS);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const rows = React.useMemo(() => buildRows(logs), [logs]);

  function handleCreateLog(values: ProductionFormValues) {
    const newLog: ProductionLogData = {
      id: `log_${Date.now()}`,
      productId: values.productId,
      userName: user.name,
      quantityProduced: values.quantityProduced,
      quantityLost: values.quantityLost,
      lossReason: values.lossReason || undefined,
      notes: values.notes || undefined,
      status: values.status,
      producedAt: new Date().toISOString(),
    };

    setLogs((prev) => [newLog, ...prev]);
    setIsFormOpen(false);
  }

  const columns: DataTableColumn<ProductRow>[] = [
    {
      key: "name",
      header: "Produto",
      render: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.category}</p>
        </div>
      ),
    },
    {
      key: "target",
      header: "Meta do dia",
      align: "right",
      hideOnMobile: true,
      render: (row) => (
        <span className="tabular-nums text-muted-foreground">
          {row.dailyTarget} {row.unit}
        </span>
      ),
    },
    {
      key: "produced",
      header: "Produzido",
      align: "right",
      render: (row) => (
        <span className="tabular-nums font-medium text-foreground">
          {row.produced} {row.unit}
        </span>
      ),
    },
    {
      key: "lost",
      header: "Perdas",
      align: "right",
      hideOnMobile: true,
      render: (row) => (
        <span
          className={`tabular-nums ${row.lost > 0 ? "text-danger" : "text-muted-foreground"}`}
        >
          {row.lost} {row.unit}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge progress={row.progress} />,
    },
    {
      key: "responsible",
      header: "Responsável",
      hideOnMobile: true,
      render: (row) => (
        <span className="text-muted-foreground">{row.lastResponsible ?? "—"}</span>
      ),
    },
    {
      key: "lastUpdate",
      header: "Última atualização",
      align: "right",
      hideOnMobile: true,
      render: (row) => (
        <span className="text-muted-foreground">
          {row.lastUpdate
            ? new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(
                new Date(row.lastUpdate)
              )
            : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Produção do dia</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Meta e desempenho de cada item preparado na Pré-Operação.
          </p>
        </div>

        <Button leftIcon={<Plus className="size-4" />} onClick={() => setIsFormOpen(true)}>
          Nova produção
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.productId}
        emptyMessage="Nenhum produto cadastrado."
      />

      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Registrar produção"
        description="Preencha os dados do que foi preparado agora."
        size="md"
      >
        <ProductionForm
          products={MOCK_PRODUCTS}
          onSubmit={handleCreateLog}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
