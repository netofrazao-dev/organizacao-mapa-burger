"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, inputVariants } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { OccurrenceSeverity } from "@/lib/mock-occurrences";

export interface OccurrenceFormValues {
  title: string;
  description: string;
  severity: OccurrenceSeverity;
}

interface OccurrenceFormProps {
  onSubmit: (values: OccurrenceFormValues) => void;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
}

const SEVERITY_OPTIONS: { value: OccurrenceSeverity; label: string }[] = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
  { value: "CRITICAL", label: "Crítica" },
];

const SEVERITY_ACTIVE_CLASSES: Record<OccurrenceSeverity, string> = {
  LOW: "bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-950",
  MEDIUM: "bg-info text-white",
  HIGH: "bg-warning text-white",
  CRITICAL: "bg-danger text-white",
};

/**
 * OccurrenceFormValues
 * --------------------
 * Formulário de registro de ocorrência. A gravidade usa botões
 * segmentados (em vez de select) porque é a decisão mais importante
 * do formulário — precisa estar visível e ser rápida de escolher,
 * já que muitas vezes é preenchida com pressa, no meio do turno.
 */
export function OccurrenceForm({ onSubmit, onCancel }: OccurrenceFormProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [severity, setSeverity] = React.useState<OccurrenceSeverity>("MEDIUM");
  const [errors, setErrors] = React.useState<FormErrors>({});

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!title.trim()) next.title = "Dê um título curto para a ocorrência.";
    if (!description.trim()) next.description = "Descreva o que aconteceu.";
    else if (description.trim().length < 10)
      next.description = "Descreva com um pouco mais de detalhe (mín. 10 caracteres).";
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({ title: title.trim(), description: description.trim(), severity });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Título"
        placeholder="Ex: Vazamento na pia da cozinha"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />

      <div>
        <label htmlFor="occurrence-description" className="mb-1.5 block text-sm font-medium text-foreground">
          Descrição
        </label>
        <textarea
          id="occurrence-description"
          rows={4}
          placeholder="Explique o que aconteceu, desde quando e qualquer providência já tomada..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={cn(
            inputVariants({ hasError: Boolean(errors.description) }),
            "resize-none py-2.5"
          )}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs font-medium text-danger">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Gravidade</label>
        <div className="grid grid-cols-4 gap-1.5">
          {SEVERITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSeverity(option.value)}
              className={cn(
                "rounded-md border border-border px-2 py-1.5 text-sm font-medium transition-colors duration-150",
                severity === option.value
                  ? SEVERITY_ACTIVE_CLASSES[option.value]
                  : "bg-surface text-muted-foreground hover:bg-muted"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-1 flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Registrar ocorrência
        </Button>
      </div>
    </form>
  );
}
