
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ReportAnalysis, StockItem } from "./types";

/**
 * Analyzes stock report data to generate insights
 */
export const analyzeStockReport = async (reportId: string): Promise<ReportAnalysis> => {
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
