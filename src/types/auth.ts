/**
 * Tipos de domínio para autenticação e sessão.
 * Espelham (de forma simplificada) os models Prisma User/Role/Sector,
 * mas achatados para consumo direto na interface.
 */

export type RoleSlug = "gerente" | "caixa" | "cozinheira" | "estoquista" | "salao";

export interface SessionRole {
  name: string;
  slug: RoleSlug;
  level: number;
}

export interface SessionSector {
  name: string;
  slug: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: SessionRole;
  sector: SessionSector | null;
}

export type LoginResult =
  | { success: true; user: SessionUser }
  | { success: false; error: string };
