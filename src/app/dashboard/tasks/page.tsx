"use client";

import * as React from "react";
import { CheckCircle2, Circle, ClipboardList, ListChecks } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useSession } from "@/components/providers/SessionProvider";
import { getCurrentShift } from "@/lib/shift";
import { MOCK_TASKS, type TaskData } from "@/lib/mock-tasks";

/**
 * Página de Tarefas — coração do sistema (POPs).
 *
 * Formato: lista de cards em duas colunas (Pendentes / Concluídas),
 * um "Kanban simplificado" — preferido a um Kanban completo com
 * drag-and-drop porque o fluxo real é binário (fez ou não fez a
 * tarefa), então arrastar cards adicionaria fricção sem ganho.
 *
 * Filtra automaticamente pelas tarefas do turno vigente, já que é
 * isso que importa pro funcionário agora — não uma lista de tudo
 * que existe no sistema.
 */
export default function TasksPage() {
  const { user } = useSession();
  const shift = React.useMemo(() => getCurrentShift(), []);

  const shiftTasks = React.useMemo(
    () => MOCK_TASKS.filter((t) => t.shiftSlug === shift.slug),
    [shift.slug]
  );

  const [completedIds, setCompletedIds] = React.useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = React.useState<TaskData | null>(null);

  const pending = shiftTasks.filter((t) => !completedIds.has(t.id));
  const completed = shiftTasks.filter((t) => completedIds.has(t.id));

  function handleComplete(taskId: string) {
    setCompletedIds((prev) => new Set(prev).add(taskId));
    setSelectedTask(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Checklist do turno</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Turno atual: <span className="font-medium text-foreground">{shift.name}</span> ·{" "}
          {completed.length} de {shiftTasks.length} concluídas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Coluna: Pendentes */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Circle className="size-4" />
            Pendentes
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
              {pending.length}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {pending.length === 0 && (
              <Card variant="outline" padding="lg" className="text-center">
                <ListChecks className="mx-auto mb-2 size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma tarefa pendente para este turno. Bom trabalho!
                </p>
              </Card>
            )}

            {pending.map((task) => (
              <Card
                key={task.id}
                variant="interactive"
                padding="sm"
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                    <ClipboardList className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate">{task.title}</CardTitle>
                    <CardDescription>{task.checklistTitle}</CardDescription>
                  </div>
                  {task.isRequired && (
                    <span className="mt-0.5 shrink-0 rounded-full bg-warning-subtle px-2 py-0.5 text-[11px] font-medium text-warning">
                      Obrigatória
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Coluna: Concluídas */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CheckCircle2 className="size-4" />
            Concluídas
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
              {completed.length}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {completed.length === 0 && (
              <Card variant="outline" padding="lg" className="text-center">
                <p className="text-sm text-muted-foreground">
                  As tarefas concluídas aparecem aqui.
                </p>
              </Card>
            )}

            {completed.map((task) => (
              <Card key={task.id} variant="default" padding="sm" className="opacity-70">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-success-subtle text-success">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate line-through">{task.title}</CardTitle>
                    <CardDescription>{task.checklistTitle}</CardDescription>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de detalhe do POP */}
      <Modal
        open={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.pop.title ?? ""}
        description={selectedTask?.checklistTitle}
        footer={
          selectedTask && (
            <>
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                Fechar
              </Button>
              <Button variant="primary" onClick={() => handleComplete(selectedTask.id)}>
                Concluir tarefa
              </Button>
            </>
          )
        }
      >
        {selectedTask && (
          <ol className="flex flex-col gap-3">
            {selectedTask.pop.steps.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm text-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <span className="pt-px leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        )}
      </Modal>
    </div>
  );
}
