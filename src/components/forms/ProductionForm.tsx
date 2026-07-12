"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, inputVariants } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ProductData, ProductionStatus } from "@/lib/mock-production";

export interface ProductionFormValues {
  productId: string;
  quantityProduced: number;
  quantityLost: number;
  lossReason: string;
  notes: string;
  status: ProductionStatus;
}

interface ProductionFormProps {
  products: ProductData[];
  onSubmit: (values: ProductionFormValues) => void;
  onCancel: () => void;
}

interface FormErrors {
  productId?: string;
  quantityProduced?: string;
  quantityLost?: string;
}

/**
 * ProductionForm
 * --------------
 * Formulário de registro de produção da Pré-Operação. Prioriza
 * velocidade de preenchimento (poucos campos, tipos numéricos com
 * teclado numérico no mobile) e validação visual imediata — erros
 * aparecem no próprio campo assim que o usuário tenta enviar, sem
 * bloquear a digitação antes disso (evita "erro prematuro" enquanto
 * a pessoa ainda está preenchendo).
 */
export function ProductionForm({ products, onSubmit, onCancel }: ProductionFormProps) {
  const [productId, setProductId] = React.useState("");
  const [quantityProduced, setQuantityProduced] = React.useState("");
  const [quantityLost, setQuantityLost] = React.useState("0");
  const [lossReason, setLossReason] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [errors, setErrors] = React.useState<FormErrors>({});

  const selectedProduct = products.find((p) => p.id === productId);

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (!productId) {
      next.productId = "Selecione o produto que foi preparado.";
    }

    const produced = Number(quantityProduced.replace(",", "."));
    if (!quantityProduced) {
      next.quantityProduced = "Informe a quantidade produzida.";
    } else if (Number.isNaN(produced) || produced <= 0) {
      next.quantityProduced = "Quantidade deve ser um número maior que zero.";
    }

    const lost = Number(quantityLost.replace(",", "."));
    if (quantityLost && (Number.isNaN(lost) || lost < 0)) {
      next.quantityLost = "Perda não pode ser negativa.";
    }

    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const producedNum = Number(quantityProduced.replace(",", "."));
    const lostNum = quantityLost ? Number(quantityLost.replace(",", ".")) : 0;

    onSubmit({
      productId,
      quantityProduced: producedNum,
      quantityLost: lostNum,
      lossReason: lossReason.trim(),
      notes: notes.trim(),
      status: producedNum < (selectedProduct?.dailyTarget ?? Infinity) ? "PARTIAL" : "COMPLETED",
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Produto */}
      <div>
        <label htmlFor="product" className="mb-1.5 block text-sm font-medium text-foreground">
          Produto
        </label>
        <div className="relative">
          <select
            id="product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className={cn(
              inputVariants({ hasError: Boolean(errors.productId) }),
              "appearance-none pr-9"
            )}
            aria-invalid={Boolean(errors.productId)}
          >
            <option value="" disabled>
              Selecione o que foi produzido
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} · meta {product.dailyTarget}
                {product.unit}
              </option>
            ))}
          </select>
          {errors.productId && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-danger">
              <AlertCircle className="size-4" />
            </span>
          )}
        </div>
        {errors.productId && (
          <p className="mt-1.5 text-xs font-medium text-danger">{errors.productId}</p>
        )}
      </div>

      {/* Quantidade produzida / perdida — lado a lado no desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={`Quantidade produzida${selectedProduct ? ` (${selectedProduct.unit})` : ""}`}
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          placeholder="0"
          value={quantityProduced}
          onChange={(e) => setQuantityProduced(e.target.value)}
          error={errors.quantityProduced}
        />

        <Input
          label={`Insumo perdido${selectedProduct ? ` (${selectedProduct.unit})` : ""}`}
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          placeholder="0"
          value={quantityLost}
          onChange={(e) => setQuantityLost(e.target.value)}
          error={errors.quantityLost}
          helperText={!errors.quantityLost ? "Deixe 0 se não houve perda." : undefined}
        />
      </div>

      {/* Motivo da perda — só relevante se houve perda */}
      {Number(quantityLost.replace(",", ".")) > 0 && (
        <Input
          label="Motivo da perda"
          placeholder="Ex: queimou na chapa, caiu no chão..."
          value={lossReason}
          onChange={(e) => setLossReason(e.target.value)}
        />
      )}

      {/* Observações */}
      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-foreground">
          Observações{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Alguma observação sobre esta produção..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={cn(inputVariants(), "resize-none py-2.5")}
        />
      </div>

      <div className="mt-1 flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Registrar produção
        </Button>
      </div>
    </form>
  );
}
