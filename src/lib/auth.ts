import type { LoginResult, SessionUser } from "@/types/auth";

/**
 * mockLogin
 * ---------
 * Simula a validação de credenciais contra o banco (Prisma entra em
 * etapa futura, quando a API de auth for implementada). Serve para:
 *  - Desenvolver e testar a tela de login de ponta a ponta;
 *  - Validar o roteamento de permissões por cargo na interface.
 *
 * Usuários de teste (senha para todos: "123456"):
 *  - gerente@mapaburger.com   → Gerente   (level 100)
 *  - caixa@mapaburger.com     → Caixa     (level 20)
 *  - cozinha@mapaburger.com   → Cozinheira(level 20)
 *  - estoque@mapaburger.com   → Estoquista(level 30)
 */

const MOCK_PASSWORD = "123456";

export const MOCK_USERS: SessionUser[] = [
  {
    id: "usr_gerente_01",
    name: "Fernanda Alencar",
    email: "gerente@mapaburger.com",
    avatarUrl: null,
    role: { name: "Gerente", slug: "gerente", level: 100 },
    sector: { name: "Administrativo", slug: "administrativo" },
  },
  {
    id: "usr_caixa_01",
    name: "Rodrigo Nunes",
    email: "caixa@mapaburger.com",
    avatarUrl: null,
    role: { name: "Caixa", slug: "caixa", level: 20 },
    sector: { name: "Caixa", slug: "caixa" },
  },
  {
    id: "usr_cozinha_01",
    name: "Patrícia Souza",
    email: "cozinha@mapaburger.com",
    avatarUrl: null,
    role: { name: "Cozinheira", slug: "cozinheira", level: 20 },
    sector: { name: "Cozinha", slug: "cozinha" },
  },
  {
    id: "usr_estoque_01",
    name: "Bruno Lima",
    email: "estoque@mapaburger.com",
    avatarUrl: null,
    role: { name: "Estoquista", slug: "estoquista", level: 30 },
    sector: { name: "Estoque", slug: "estoque" },
  },
];

/** Simula latência real de rede/banco. */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Valida email + senha contra a base mock e retorna o usuário (com
 * cargo e setor) em caso de sucesso. A interface usa `role.slug` e
 * `role.level` para decidir quais rotas/ações liberar.
 */
export async function mockLogin(email: string, password: string): Promise<LoginResult> {
  await delay(600);

  const normalizedEmail = email.trim().toLowerCase();
  const user = MOCK_USERS.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, error: "Não encontramos um usuário com esse e-mail." };
  }

  if (password !== MOCK_PASSWORD) {
    return { success: false, error: "Senha incorreta. Tente novamente." };
  }

  return { success: true, user };
}
