"use client";

import * as React from "react";
import { PackageSearch, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, inputVariants } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { InventoryItemData, PurchaseUrgency } from "@/lib/mock-inventory";

export interface PurchaseRequestValues {
  inventoryItemId: string;
  quantityRequested: number;
  urgency: PurchaseUrgency;
  notes: string;
}

interface RequestPurchaseProps {
  item: InventoryItemData;
  onSubmit: (values: PurchaseRequestValues) => void;
  onCancel?: () => void;
}

const URGENCY_OPTIONS: { value: PurchaseUrgency; label: string }[] = [
  { value: "LOW", label: "Baixa" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "Urgente" },
];

const URGENCY_ACTIVE_CLASSES: Record<PurchaseUrgency, string> = {
  LOW: "bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-950",
  NORMAL: "bg-brand-500 text-white",
  HIGH: "bg-danger text-white",
};

/**
 * RequestPurchase
 * ----------------
 * Card simples para o funcionário sinalizar, em poucos toques, que um
 * item está acabando — sem precisar navegar por um formulário longo.
 * A urgência é escolhida por botões segmentados (mais rápido que um
 * select em um tablet no balcão) e some do fluxo assim que enviada,
 * ficando pendente de aprovação do gerente.
 */
export function RequestPurchase({ item, onSubmit, onCancel }: RequestPurchaseProps) {
  const [quantity, setQuantity] = React.useState(String(Math.max(item.maxQty - item.currentQty, item.minQty)));
  const [urgency, setUrgency] = React.useState<PurchaseUrgency>("NORMAL");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qty = Number(quantity.replace(",", "."));

    if (!quantity || Number.isNaN(qty) || qty <= 0) {
      setError("Informe uma quantidade válida.");
      return;
    }

    setError(null);
    onSubmit({
      inventoryItemId: item.id,
      quantityRequested: qty,
      urgency,
      notes: notes.trim(),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card padding="lg" className="text-center">
        <CardContent>
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-success-subtle text-success">
            <Send className="size-5" />
          </div>
          <p className="text-sm font-medium text-foreground">Solicitação enviada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            O gerente do turno foi notificado e vai avaliar a compra de{" "}
            <span className="font-medium text-foreground">{item.name}</span>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          <PackageSearch className="size-4.5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">
            Estoque atual: {item.currentQty} {item.unit} · Mínimo: {item.minQty} {item.unit}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label={`Quantidade sugerida (${item.unit})`}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          error={error ?? undefined}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Urgência</label>
          <div className="grid grid-cols-3 gap-1.5">
            {URGENCY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setUrgency(option.value)}
                className={cn(
                  "rounded-md border border-border px-2 py-1.5 text-sm font-medium transition-colors duration-150",
                  urgency === option.value
                    ? URGENCY_ACTIVE_CLASSES[option.value]
                    : "bg-surface text-muted-foreground hover:bg-muted"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="request-notes" className="mb-1.5 block text-sm font-medium text-foreground">
            Observações <span className="font-normal text-muted-foreground">(opcional)</span>
          </label>
          <textarea
            id="request-notes"
            rows={2}
            placeholder="Ex: fornecedor habitual sem entrega essa semana..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={cn(inputVariants(), "resize-none py-2.5")}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" leftIcon={<Send className="size-4" />}>
            Enviar solicitação
          </Button>
        </div>
      </form>
    </Card>
  );
}
