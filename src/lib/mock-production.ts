export interface ProductData {
  id: string;
  name: string;
  category: string;
  unit: string;
  dailyTarget: number;
}

export type ProductionStatus = "COMPLETED" | "PARTIAL" | "CANCELLED";

export interface ProductionLogData {
  id: string;
  productId: string;
  userName: string;
  quantityProduced: number;
  quantityLost: number;
  lossReason?: string;
  notes?: string;
  status: ProductionStatus;
  producedAt: string; // ISO
}

export const MOCK_PRODUCTS: ProductData[] = [
  { id: "prod_01", name: "Molho especial da casa", category: "Molho", unit: "L", dailyTarget: 8 },
  { id: "prod_02", name: "Blend artesanal 120g", category: "Carne", unit: "un", dailyTarget: 150 },
  { id: "prod_03", name: "Cebola caramelizada", category: "Legume", unit: "kg", dailyTarget: 5 },
  { id: "prod_04", name: "Picles artesanal", category: "Legume", unit: "kg", dailyTarget: 3 },
  { id: "prod_05", name: "Maionese temperada", category: "Molho", unit: "L", dailyTarget: 6 },
];

export const MOCK_PRODUCTION_LOGS: ProductionLogData[] = [
  {
    id: "log_01",
    productId: "prod_01",
    userName: "Patrícia Souza",
    quantityProduced: 6,
    quantityLost: 0.5,
    lossReason: "Respingo no cozimento",
    status: "COMPLETED",
    producedAt: new Date(new Date().setHours(7, 20)).toISOString(),
  },
  {
    id: "log_02",
    productId: "prod_02",
    userName: "Patrícia Souza",
    quantityProduced: 150,
    quantityLost: 4,
    lossReason: "Peças fora do peso padrão",
    status: "COMPLETED",
    producedAt: new Date(new Date().setHours(8, 10)).toISOString(),
  },
  {
    id: "log_03",
    productId: "prod_03",
    userName: "Bruno Lima",
    quantityProduced: 2.5,
    quantityLost: 0,
    status: "PARTIAL",
    notes: "Faltou cebola no estoque para completar a meta.",
    producedAt: new Date(new Date().setHours(9, 0)).toISOString(),
  },
];
