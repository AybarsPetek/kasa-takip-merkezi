
import { supabase } from "@/integrations/supabase/client";
import { ReportData } from "./types";

/**
 * Fetches a list of reports from the database
 */
export const fetchReports = async (limit?: number): Promise<ReportData[]> => {
  try {
    let query = supabase
      .from('stok_rapor')
      .select('*')
      .order('tarih', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.ad,
      date: item.tarih,
      items: item.urun_sayisi,
      totalValue: item.toplam_deger,
      status: item.durum,
      category: item.kategori,
      filePath: item.dosya_yolu
    }));
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};
