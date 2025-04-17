
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

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

// Function to upload report file to Supabase storage
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

    // Parse file and get statistics
    const items = Math.floor(Math.random() * 300) + 50; // Simulated for now
    const totalValue = items * (Math.floor(Math.random() * 500) + 100); // Simulated for now

    // Save report metadata to database
    // For now, we'll use a placeholder user ID since we don't have auth implemented
    const placeholderUserId = "00000000-0000-0000-0000-000000000000";
    
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
        kullanici_id: placeholderUserId // Adding the required kullanici_id field
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

// Function to get report statistics from file
export const analyzeStockReport = async (reportId: string): Promise<{
  totalItems: number;
  totalValue: number;
  lowStockItems: StockItem[];
  categoryBreakdown: { category: string; count: number; value: number }[];
}> => {
  try {
    // Get report details
    const { data: report, error } = await supabase
      .from('stok_rapor')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // In a real implementation, we would download and parse the Excel file
    // For now, we'll generate sample data
    
    // Generate sample category breakdown
    const categories = ["Elektronik", "Giyim", "Gıda", "Kozmetik", "Ev Eşyası"];
    const categoryBreakdown = categories.map(category => {
      const count = Math.floor(Math.random() * 50) + 5;
      const value = count * (Math.floor(Math.random() * 200) + 100);
      return { category, count, value };
    });

    // Generate sample low stock items
    const lowStockItems: StockItem[] = [];
    for (let i = 0; i < 5; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const currentStock = Math.floor(Math.random() * 5) + 1;
      const minRequiredStock = currentStock + Math.floor(Math.random() * 10) + 5;
      const price = Math.floor(Math.random() * 1000) + 100;
      
      lowStockItems.push({
        id: uuidv4(),
        name: `Ürün ${String.fromCharCode(65 + i)}`,
        sku: `SKU-${100 + i}`,
        category,
        currentStock,
        minRequiredStock,
        price,
        totalValue: currentStock * price
      });
    }

    return {
      totalItems: report.urun_sayisi,
      totalValue: report.toplam_deger,
      lowStockItems,
      categoryBreakdown
    };
  } catch (error) {
    console.error("Error analyzing report:", error);
    throw error;
  }
};

// Function to fetch list of reports
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

// Function to download report file
export const downloadReportFile = async (filePath: string, fileName: string): Promise<void> => {
  try {
    const { data, error } = await supabase.storage
      .from('stock-reports')
      .download(filePath);
      
    if (error) {
      throw new Error(error.message);
    }
    
    // Create a download link
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'report-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
    useToast().toast({
      title: "Dosya indirme hatası",
      description: "Dosya indirilirken bir hata oluştu.",
      variant: "destructive",
    });
  }
};
