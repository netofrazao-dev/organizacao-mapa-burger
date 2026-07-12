"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Mail, Lock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { mockLogin } from "@/lib/auth";

/**
 * Tela de Login — Mapa Burger
 *
 * Princípios de design aplicados:
 *  - Zero distração: um único cartão centralizado, sem sidebar, sem marketing.
 *  - Rapidez: apenas 2 campos + 1 ação. Foco automático no campo de e-mail.
 *  - Feedback imediato: erro de credencial aparece inline, no próprio campo.
 *  - Pode ser operado só de teclado (Tab + Enter) para uso rápido no balcão.
 */
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await mockLogin(email, password);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    // Turnos e permissões (Etapa 3+) decidem a rota final por cargo.
    // Por ora, todos caem no dashboard geral.
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm">
        {/* Marca */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm">
            <UtensilsCrossed className="size-5" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Mapa Burger</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre para acessar o painel operacional
          </p>
        </div>

        <Card padding="lg">
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <Input
                label="E-mail"
                type="email"
                placeholder="seu.email@mapaburger.com"
                autoComplete="email"
                autoFocus
                leftIcon={<Mail className="size-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                leftIcon={<Lock className="size-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error ?? undefined}
                required
              />

              <Button
                type="submit"
                size="lg"
                className="mt-1.5 w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="size-4" />}
              >
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Acesso restrito à equipe Mapa Burger. Problemas para entrar? Fale com o gerente do turno.
        </p>
      </div>
    </main>
  );
}
