export type OccurrenceSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type OccurrenceStatus = "OPEN" | "IN_REVIEW" | "RESOLVED";

export interface OccurrenceData {
  id: string;
  title: string;
  description: string;
  severity: OccurrenceSeverity;
  status: OccurrenceStatus;
  reportedByName: string;
  createdAt: string; // ISO
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

export const MOCK_OCCURRENCES: OccurrenceData[] = [
  {
    id: "occ_01",
    title: "Fritador 2 fazendo barulho estranho",
    description:
      "Desde o almoço o fritador da direita está com um barulho de motor forçando. Ainda funciona, mas parece que vai parar.",
    severity: "HIGH",
    status: "OPEN",
    reportedByName: "Patrícia Souza",
    createdAt: hoursAgo(2),
  },
  {
    id: "occ_02",
    title: "Cliente reclamou de demora no delivery",
    description:
      "Pedido #4521 demorou 55 minutos para sair. Motoboy chegou atrasado, mas a produção também já estava represada.",
    severity: "MEDIUM",
    status: "IN_REVIEW",
    reportedByName: "Rodrigo Nunes",
    createdAt: hoursAgo(5),
  },
  {
    id: "occ_03",
    title: "Vazamento embaixo da pia da cozinha",
    description: "Pequeno vazamento identificado na tubulação embaixo da pia principal. Coloquei um balde por enquanto.",
    severity: "CRITICAL",
    status: "OPEN",
    reportedByName: "Bruno Lima",
    createdAt: hoursAgo(1),
  },
  {
    id: "occ_04",
    title: "Impressora de cupom travando",
    description: "A impressora do caixa está travando papel a cada 4-5 impressões. Já limpei o sensor, mas continua.",
    severity: "LOW",
    status: "RESOLVED",
    reportedByName: "Rodrigo Nunes",
    createdAt: hoursAgo(30),
  },
];
