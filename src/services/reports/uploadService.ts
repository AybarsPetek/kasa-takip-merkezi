
import { supabase } from "@/integrations/supabase/client";
import { ReportData } from "./types";

// Placeholder user ID since we don't have auth implemented yet
const PLACEHOLDER_USER_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Uploads a report file to Supabase storage and saves metadata to the database
 */
export const uploadReportFile = async (file: File, reportName: string, reportDate: string): Promise<ReportData | null> => {
  try {
    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${reportName.replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
    const filePath = `reports/${fileName}`;

    // Upload file to Supabase storage
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('stock-reports')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return null;
    }

    // Parse file and get statistics (simulated for now)
    const items = Math.floor(Math.random() * 300) + 50;
    const totalValue = items * (Math.floor(Math.random() * 500) + 100);
    
    // Save report metadata to database
    const { data: reportRecord, error: dbError } = await supabase
      .from('stok_rapor')
      .insert({
        ad: reportName,
        tarih: reportDate,
        urun_sayisi: items,
        toplam_deger: totalValue,
        durum: "Tamamlandı",
        kategori: "Aylık",
        dosya_yolu: filePath,
        kullanici_id: PLACEHOLDER_USER_ID
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error saving report to database:", dbError);
      return null;
    }

    // Format the response
    return {
      id: reportRecord.id,
      name: reportRecord.ad,
      date: reportRecord.tarih,
      items: reportRecord.urun_sayisi,
      totalValue: reportRecord.toplam_deger,
      status: reportRecord.durum,
      category: reportRecord.kategori,
      filePath: reportRecord.dosya_yolu
    };
  } catch (error) {
    console.error("Error processing report upload:", error);
    return null;
  }
};
