
// Custom type definitions for database entities
// These complement the auto-generated Supabase types

export interface Kullanici {
  id: string;
  email: string;
  ad: string;
  soyad: string;
  rol: string;
  aktif: boolean;
  olusturma_tarihi: string;
  son_giris?: string;
}

export interface KasaSayim {
  id: string;
  tarih: string;
  kullanici_id: string;
  banknot_toplami: number;
  bozuk_para_toplami: number;
  toplam: number;
  onceki_miktar: number;
  fark: number;
  not?: string;
  durum: string;
}

export interface KasaSayimDetay {
  id: string;
  kasa_sayim_id: string;
  para_tipi: 'banknot' | 'bozuk';
  deger: number;
  adet: number;
  toplam: number;
}

export interface NakitTeslim {
  id: string;
  tarih: string;
  kullanici_id: string;
  teslim_alan: string;
  miktar: number;
  not?: string;
  durum: string;
}

export interface StokRapor {
  id: string;
  ad: string;
  tarih: string;
  kullanici_id: string;
  dosya_yolu?: string;
  urun_sayisi: number;
  toplam_deger: number;
  kategori: string;
  durum: string;
}

export interface AzalanStok {
  id: string;
  urun_adi: string;
  mevcut_stok: number;
  minimum_stok: number;
  kategori: string;
  durum: 'Kritik' | 'Az';
}
