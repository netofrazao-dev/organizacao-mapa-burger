/**
 * Turnos operacionais do Mapa Burger.
 * Os horários espelham os registros que existirão na tabela `Shift`
 * (Prisma) — aqui mantidos como constante para uso síncrono na UI.
 */
export const SHIFTS = [
  { name: "Pré-Operação", slug: "pre-operacao", startHour: 6, endHour: 11 },
  { name: "Almoço", slug: "almoco", startHour: 11, endHour: 16 },
  { name: "Noite", slug: "noite", startHour: 16, endHour: 24 },
] as const;

export type Shift = (typeof SHIFTS)[number];

/** Retorna o turno vigente com base na hora local atual. */
export function getCurrentShift(date: Date = new Date()): Shift {
  const hour = date.getHours();
  const found = SHIFTS.find((s) => hour >= s.startHour && hour < s.endHour);
  return found ?? SHIFTS[0];
}
