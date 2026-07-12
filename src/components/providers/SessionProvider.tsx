"use client";

import * as React from "react";
import type { SessionUser } from "@/types/auth";
import { MOCK_USERS } from "@/lib/auth";

interface SessionContextValue {
  user: SessionUser;
  setUser: (user: SessionUser) => void;
}

const SessionContext = React.createContext<SessionContextValue | null>(null);

/**
 * SessionProvider
 * ---------------
 * Fornece o usuário logado para toda a área `dashboard`. Por ora usa um
 * usuário mock fixo (Gerente) como sessão ativa de demonstração — no
 * momento em que a Etapa de autenticação real for implementada, este
 * provider passa a ler de um cookie/JWT em vez do array mock, mantendo
 * a mesma interface (`useSession`) para o resto da aplicação.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser>(MOCK_USERS[0]);

  return (
    <SessionContext.Provider value={{ user, setUser }}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = React.useContext(SessionContext);
  if (!ctx) throw new Error("useSession deve ser usado dentro de <SessionProvider>");
  return ctx;
}
