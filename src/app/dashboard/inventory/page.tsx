"use client";

import * as React from "react";
import { Search, ShoppingCart, CircleAlert, CheckCircle2, CircleX } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RequestPurchase, type PurchaseRequestValues } from "@/components/inventory/RequestPurchase";
import {
  MOCK_INVENTORY,
  getStockStatus,
  type InventoryItemData,
  type StockStatus,
} from "@/lib/mock-inventory";

const STATUS_CONFIG: Record<
  StockStatus,
  { label: string; dot: string; badge: string; icon: React.ElementType }
> = {
  normal: {
    label: "Normal",
    dot: "bg-success",
    badge: "bg-success-subtle text-success",
    icon: CheckCircle2,
  },
  alerta: {
    label: "Alerta",
    dot: "bg-warning",
    badge: "bg-warning-subtle text-warning",
    icon: CircleAlert,
  },
  critico: {
    label: "Crítico",
    dot: "bg-danger",
    badge: "bg-danger-subtle text-danger",
    icon: CircleX,
  },
};

function StatusBadge({ status }: { status: StockStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}
    >
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
}

function LevelBar({ item }: { item: InventoryItemData }) {
  const status = getStockStatus(item);
  const percent = Math.min(100, Math.round((item.currentQty / item.maxQty) * 100));
  const barColor =
    status === "critico" ? "bg-danger" : status === "alerta" ? "bg-warning" : "bg-success";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="tabular-nums text-xs text-muted-foreground">{percent}%</span>
    </div>
  );
}

export default function InventoryPage() {
  const [search, setSearch] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<InventoryItemData | null>(null);
  const [sentRequests, setSentRequests] = React.useState<PurchaseRequestValues[]>([]);

  const filteredItems = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MOCK_INVENTORY;
    return MOCK_INVENTORY.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
    );
  }, [search]);

  function handleRequestSubmit(values: PurchaseRequestValues) {
    setSentRequests((prev) => [...prev, values]);
  }

  const criticalCount = MOCK_INVENTORY.filter((i) => getStockStatus(i) === "critico").length;

  const columns: DataTableColumn<InventoryItemData>[] = [
    {
      key: "name",
      header: "Item",
      render: (item) => (
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.category}</p>
        </div>
      ),
    },
    {
      key: "current",
      header: "Estoque atual",
      align: "right",
      render: (item) => (
        <span className="tabular-nums font-medium text-foreground">
          {item.currentQty} {item.unit}
        </span>
      ),
    },
    {
      key: "level",
      header: "Nível",
      hideOnMobile: true,
      render: (item) => <LevelBar item={item} />,
    },
    {
      key: "min",
      header: "Mín. / Máx.",
      align: "right",
      hideOnMobile: true,
      render: (item) => (
        <span className="tabular-nums text-muted-foreground">
          {item.minQty} / {item.maxQty} {item.unit}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={getStockStatus(item)} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (item) => {
        const alreadyRequested = sentRequests.some((r) => r.inventoryItemId === item.id);
        return (
          <Button
            size="sm"
            variant={alreadyRequested ? "ghost" : "outline"}
            disabled={alreadyRequested}
            leftIcon={<ShoppingCart className="size-3.5" />}
            onClick={() => setSelectedItem(item)}
          >
            {alreadyRequested ? "Solicitado" : "Solicitar"}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Estoque</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {criticalCount > 0 ? (
              <span className="font-medium text-danger">
                {criticalCount} {criticalCount === 1 ? "item crítico" : "itens críticos"} agora
              </span>
            ) : (
              "Nenhum item em nível crítico no momento."
            )}
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Buscar por item ou categoria..."
            leftIcon={<Search className="size-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        getRowId={(item) => item.id}
        emptyMessage="Nenhum item encontrado para essa busca."
      />

      <Modal
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        title="Solicitar compra"
        description="Sinalize a falta para o gerente do turno aprovar."
      >
        {selectedItem && (
          <RequestPurchase
            item={selectedItem}
            onSubmit={(values) => {
              handleRequestSubmit(values);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
