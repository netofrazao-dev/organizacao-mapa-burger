export interface NoticeData {
  id: string;
  title: string;
  content: string;
  authorName: string;
  pinned: boolean;
  createdAt: string; // ISO
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

export const MOCK_NOTICES: NoticeData[] = [
  {
    id: "notice_01",
    title: "Novo fornecedor de pães a partir de segunda",
    content:
      "A partir de segunda-feira o pão brioche vem do novo fornecedor. Confiram a validade com atenção nos primeiros dias.",
    authorName: "Fernanda Alencar",
    pinned: true,
    createdAt: hoursAgo(3),
  },
  {
    id: "notice_02",
    title: "Manutenção da coifa marcada para quarta",
    content:
      "Equipe de manutenção chega às 6h de quarta para limpeza da coifa. Cozinha deve iniciar a abertura com 30 min de antecedência.",
    authorName: "Fernanda Alencar",
    pinned: false,
    createdAt: hoursAgo(20),
  },
  {
    id: "notice_03",
    title: "Parabéns pela meta de produção da semana!",
    content: "Batemos a meta de produção 5 dias seguidos. Obrigada, time!",
    authorName: "Fernanda Alencar",
    pinned: false,
    createdAt: hoursAgo(48),
  },
];
