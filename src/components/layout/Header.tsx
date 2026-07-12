"use client";

import * as React from "react";
import { Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useSession } from "@/components/providers/SessionProvider";
import { getCurrentShift } from "@/lib/shift";
import { Button } from "@/components/ui/Button";

/**
 * Header
 * ------
 * Fica fixo no topo da área logada. Mostra, da esquerda pra direita:
 * espaço reservado pro botão mobile da Sidebar, o turno vigente
 * (calculado pela hora do sistema) e o usuário logado, seguido do
 * toggle de tema — ação de baixa frequência, por isso fica isolada
 * à direita, longe de ações do dia a dia.
 */
export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useSession();
  // Começa como `null`: calcular o turno já no useState(() => ...) faria
  // servidor e cliente potencialmente discordarem sobre a hora atual
  // bem no instante da virada de turno, disparando hydration mismatch.
  // Calculamos só depois de montado no navegador.
  const [shift, setShift] = React.useState<ReturnType<typeof getCurrentShift> | null>(null);

  React.useEffect(() => {
    setShift(getCurrentShift());
    // Reavalia o turno a cada minuto — evita ficar com badge desatualizado
    // em sessões longas (funcionários passam o dia inteiro logados).
    const interval = setInterval(() => setShift(getCurrentShift()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-surface pl-14 pr-4 md:pl-5">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          Turno: {shift?.name ?? "—"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-tight text-foreground">{user.name}</p>
          <p className="text-xs leading-tight text-muted-foreground">{user.role.name}</p>
        </div>

        <div className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
          {user.name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
        >
          {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </Button>

        <Button type="button" variant="ghost" size="icon" aria-label="Sair">
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
