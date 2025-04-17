
// Tüm dashboard ile ilgili ortak tipleri burada tanımlıyoruz
export interface Transaction {
  id: string | number;
  type: string;
  amount: number;
  date: string;
  status: string;
}

export interface Report {
  id: string | number;
  name: string;
  date: string;
  items: number;
}

export interface TodayStats {
  totalCash: number;
  cashIn: number;
  cashOut: number;
  difference: number;
}

export interface LowStockItem {
  id: string;
  urun_adi: string;
  mevcut_stok: number;
  minimum_stok: number;
  kategori: string;
  durum: "Kritik" | "Az";
}
