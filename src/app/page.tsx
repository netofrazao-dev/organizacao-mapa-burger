import { Users } from "lucide-react";

/**
 * Página de Equipe — ainda não faz parte do escopo das 8 etapas
 * originais, mas já está referenciada no menu do Gerente. Este stub
 * evita o 404 até a tela real (escala, cargos, setores) ser construída.
 */
export default function EquipePage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center pt-16 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
        <Users className="size-5" />
      </div>
      <h1 className="text-lg font-semibold text-foreground">Equipe</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        A gestão de escala, cargos e setores dos funcionários ainda está em construção.
      </p>
    </div>
  );
}
