
import { supabase } from "@/integrations/supabase/client";
import { KasaSayim, NakitTeslim, StokRapor, AzalanStok } from "@/types/database";

// Fetch the latest cash counts
export const fetchRecentTransactions = async (limit = 5): Promise<KasaSayim[] | NakitTeslim[]> => {
  // Get recent cash counts
  const { data: kasaSayimData, error: kasaError } = await supabase
    .from('kasa_sayim')
    .select('*')
    .order('tarih', { ascending: false })
    .limit(limit);
  
  if (kasaError) {
    console.error('Error fetching kasa_sayim data:', kasaError);
    return [];
  }
  
  // Get recent cash deliveries
  const { data: nakitTeslimData, error: nakitError } = await supabase
    .from('nakit_teslim')
    .select('*')
    .order('tarih', { ascending: false })
    .limit(limit);
  
  if (nakitError) {
    console.error('Error fetching nakit_teslim data:', nakitError);
    return [];
  }
  
  // Combine and sort by date
  const combinedTransactions = [
    ...kasaSayimData.map(item => ({ ...item, type: 'Kasa Sayım' })),
    ...nakitTeslimData.map(item => ({ ...item, type: 'Nakit Teslim' }))
  ].sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime());
  
  return combinedTransactions.slice(0, limit);
};

// Fetch the latest inventory reports
export const fetchRecentReports = async (limit = 5): Promise<StokRapor[]> => {
  const { data, error } = await supabase
    .from('stok_rapor')
    .select('*')
    .order('tarih', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching stok_rapor data:', error);
    return [];
  }
  
  return data;
};

// Fetch today's cash statistics
export const fetchTodayStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get all kasa_sayim entries for today
  const { data: kasaData, error: kasaError } = await supabase
    .from('kasa_sayim')
    .select('*')
    .gte('tarih', today.toISOString())
    .order('tarih', { ascending: false });
    
  if (kasaError) {
    console.error('Error fetching today kasa data:', kasaError);
    return {
      totalCash: 0,
      cashIn: 0,
      cashOut: 0,
      difference: 0
    };
  }
  
  // Get all nakit_teslim entries for today
  const { data: teslimData, error: teslimError } = await supabase
    .from('nakit_teslim')
    .select('*')
    .gte('tarih', today.toISOString());
  
  if (teslimError) {
    console.error('Error fetching today teslim data:', teslimError);
    return {
      totalCash: 0,
      cashIn: 0,
      cashOut: 0,
      difference: 0
    };
  }
  
  // Calculate totals
  const cashIn = kasaData.length > 0 ? kasaData[0].toplam : 0;
  const cashOut = teslimData.reduce((sum, item) => sum + item.miktar, 0);
  
  return {
    totalCash: cashIn - cashOut,
    cashIn: cashIn,
    cashOut: cashOut,
    difference: cashIn - cashOut
  };
};

// Fetch low stock items
export const fetchLowStockItems = async (limit = 5): Promise<AzalanStok[]> => {
  const { data, error } = await supabase
    .from('azalan_stok')
    .select('*')
    .order('mevcut_stok', { ascending: true })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching low stock items:', error);
    return [];
  }
  
  return data;
};
