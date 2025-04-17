
export interface ReportData {
  id: string;
  name: string;
  date: string;
  items: number;
  totalValue: number;
  status: string;
  category: string;
  fileName?: string;
  filePath?: string;
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minRequiredStock: number;
  price: number;
  totalValue: number;
}

export interface ReportAnalysis {
  totalItems: number;
  totalValue: number;
  lowStockItems: StockItem[];
  categoryBreakdown: { category: string; count: number; value: number }[];
}
