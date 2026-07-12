"use client";

import * as React from "react";
import { Plus, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { OccurrenceForm, type OccurrenceFormValues } from "@/components/occurrences/OccurrenceForm";
import { useSession } from "@/components/providers/SessionProvider";
import { formatRelativeTime } from "@/lib/format-time";
import {
  MOCK_OCCURRENCES,
  type OccurrenceData,
  type OccurrenceSeverity,
  type OccurrenceStatus,
} from "@/lib/mock-occurrences";

const SEVERITY_CONFIG: Record<OccurrenceSeverity, { label: string; bar: string; text: string }> = {
  LOW: { label: "Baixa", bar: "bg-ink-400", text: "text-muted-foreground" },
  MEDIUM: { label: "Média", bar: "bg-info", text: "text-info" },
  HIGH: { label: "Alta", bar: "bg-warning", text: "text-warning" },
  CRITICAL: { label: "Crítica", bar: "bg-danger", text: "text-danger" },
};

const STATUS_CONFIG: Record<
  OccurrenceStatus,
  { label: string; badge: string; icon: React.ElementType }
> = {
  OPEN: { label: "Aberto", badge: "bg-danger-subtle text-danger", icon: AlertTriangle },
  IN_REVIEW: { label: "Em Análise", badge: "bg-warning-subtle text-warning", icon: Clock },
  RESOLVED: { label: "Resolvido", badge: "bg-success-subtle text-success", icon: CheckCircle2 },
};

const FILTERS: { value: OccurrenceStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "OPEN", label: "Abertas" },
  { value: "IN_REVIEW", label: "Em análise" },
  { value: "RESOLVED", label: "Resolvidas" },
];

function StatusBadge({ status }: { status: OccurrenceStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}
    >
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
}

/**
 * Página de Ocorrências — feed cronológico (mais recente primeiro),
 * pensado para comunicação entre turnos: quem chega no turno seguinte
 * consegue ler rapidamente o que aconteceu e o que ainda está pendente.
 */
export default function OccurrencesPage() {
  const { user } = useSession();
  const [occurrences, setOccurrences] = React.useState<OccurrenceData[]>(MOCK_OCCURRENCES);
  const [filter, setFilter] = React.useState<OccurrenceStatus | "ALL">("ALL");
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const sorted = React.useMemo(
    () => [...occurrences].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [occurrences]
  );

  const filtered = filter === "ALL" ? sorted : sorted.filter((o) => o.status === filter);

  const openCount = occurrences.filter((o) => o.status === "OPEN").length;

  function handleCreate(values: OccurrenceFormValues) {
    const newOccurrence: OccurrenceData = {
      id: `occ_${Date.now()}`,
      title: values.title,
      description: values.description,
      severity: values.severity,
      status: "OPEN",
      reportedByName: user.name,
      createdAt: new Date().toISOString(),
    };

    setOccurrences((prev) => [newOccurrence, ...prev]);
    setIsFormOpen(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Ocorrências</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {openCount > 0 ? (
              <span className="font-medium text-danger">
                {openCount} {openCount === 1 ? "ocorrência aberta" : "ocorrências abertas"}
              </span>
            ) : (
              "Nenhuma ocorrência aberta no momento."
            )}
          </p>
        </div>

        <Button leftIcon={<Plus className="size-4" />} onClick={() => setIsFormOpen(true)}>
          Nova ocorrência
        </Button>
      </div>

      {/* Filtros */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
              filter === f.value
                ? "bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-950"
                : "bg-muted text-muted-foreground hover:bg-ink-100 dark:hover:bg-ink-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <Card variant="outline" padding="lg" className="text-center">
            <p className="text-sm text-muted-foreground">Nenhuma ocorrência nesse filtro.</p>
          </Card>
        )}

        {filtered.map((occurrence) => {
          const severity = SEVERITY_CONFIG[occurrence.severity];
          return (
            <Card key={occurrence.id} padding="none" className="overflow-hidden">
              <div className="flex">
                <div className={`w-1 shrink-0 ${severity.bar}`} aria-hidden="true" />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground">{occurrence.title}</h3>
                    <StatusBadge status={occurrence.status} />
                  </div>

                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {occurrence.description}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className={`font-medium ${severity.text}`}>
                      Gravidade: {severity.label}
                    </span>
                    <span>·</span>
                    <span>{occurrence.reportedByName}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(occurrence.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Nova ocorrência"
        description="Relate um problema para o gerente do turno acompanhar."
      >
        <OccurrenceForm onSubmit={handleCreate} onCancel={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}
