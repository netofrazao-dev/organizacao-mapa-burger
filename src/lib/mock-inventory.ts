export interface InventoryItemData {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentQty: number;
  minQty: number;
  maxQty: number;
}

export type StockStatus = "normal" | "alerta" | "critico";

export type PurchaseUrgency = "LOW" | "NORMAL" | "HIGH";

/** Classifica o item pela posição do estoque atual em relação ao mínimo. */
export function getStockStatus(item: InventoryItemData): StockStatus {
  if (item.currentQty <= item.minQty) return "critico";
  if (item.currentQty <= item.minQty * 1.3) return "alerta";
  return "normal";
}

export const MOCK_INVENTORY: InventoryItemData[] = [
  {
    id: "inv_01",
    name: "Pão brioche 120g",
    category: "Matéria-prima",
    unit: "un",
    currentQty: 320,
    minQty: 150,
    maxQty: 600,
  },
  {
    id: "inv_02",
    name: "Blend bovino 120g",
    category: "Matéria-prima",
    unit: "un",
    currentQty: 60,
    minQty: 100,
    maxQty: 500,
  },
  {
    id: "inv_03",
    name: "Queijo cheddar fatiado",
    category: "Matéria-prima",
    unit: "kg",
    currentQty: 4.5,
    minQty: 5,
    maxQty: 20,
  },
  {
    id: "inv_04",
    name: "Embalagem delivery média",
    category: "Embalagem",
    unit: "un",
    currentQty: 210,
    minQty: 200,
    maxQty: 1000,
  },
  {
    id: "inv_05",
    name: "Guardanapo personalizado",
    category: "Embalagem",
    unit: "un",
    currentQty: 850,
    minQty: 300,
    maxQty: 1500,
  },
  {
    id: "inv_06",
    name: "Detergente neutro",
    category: "Limpeza",
    unit: "L",
    currentQty: 2,
    minQty: 4,
    maxQty: 15,
  },
  {
    id: "inv_07",
    name: "Batata pré-frita congelada",
    category: "Matéria-prima",
    unit: "kg",
    currentQty: 38,
    minQty: 20,
    maxQty: 80,
  },
  {
    id: "inv_08",
    name: "Copo descartável 500ml",
    category: "Embalagem",
    unit: "un",
    currentQty: 95,
    minQty: 150,
    maxQty: 800,
  },
];
