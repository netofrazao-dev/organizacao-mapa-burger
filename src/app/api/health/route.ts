import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/health
 * ----------------
 * Endpoint de verificação de disponibilidade da API. Serve dois
 * propósitos:
 *  1. Monitoramento — plataformas de deploy (Vercel, Railway, etc) e
 *     ferramentas de uptime (UptimeRobot, BetterStack) fazem ping
 *     aqui para saber se a aplicação está no ar.
 *  2. Referência de padrão — este arquivo é o modelo de Route Handler
 *     mais simples do projeto. Toda futura API (app mobile, integração
 *     com um SaaS de delivery, webhook de pagamento etc.) deve seguir
 *     a mesma estrutura: validar entrada, tratar erro e responder com
 *     `NextResponse.json`, sempre com status HTTP explícito.
 *
 * Next.js App Router mapeia o nome do método HTTP para uma função
 * exportada (`GET`, `POST`, `PUT`, `DELETE`...) neste arquivo — não há
 * roteamento manual, o próprio nome do arquivo (`route.ts`) já define
 * o endpoint a partir do caminho da pasta (`/api/health`).
 */
export async function GET(request: NextRequest) {
  try {
    const startedAt = process.env.SERVER_STARTED_AT ?? new Date().toISOString();

    return NextResponse.json(
      {
        status: "ok",
        service: "mapa-burger-api",
        version: "1.0.0",
        environment: process.env.NODE_ENV ?? "development",
        timestamp: new Date().toISOString(),
        uptimeSince: startedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    // Nunca deixar um Route Handler estourar sem tratamento — sempre
    // devolver um JSON de erro consistente para quem está integrando.
    return NextResponse.json(
      { status: "error", message: "Falha ao verificar saúde da API." },
      { status: 500 }
    );
  }
}

/**
 * Exemplo de método adicional no mesmo Route Handler — útil como
 * referência para quando outra API precisar aceitar um payload
 * (ex: um app mobile enviando um "ping" com metadados do dispositivo).
 * Removido do fluxo de health check real, mas mantido comentado como
 * template:
 *
 * export async function POST(request: NextRequest) {
 *   const body = await request.json();
 *   // validar `body` (ex: com Zod) antes de qualquer coisa
 *   return NextResponse.json({ received: true, body }, { status: 201 });
 * }
 */
