
import { supabase } from "@/integrations/supabase/client";

// Interface for cash denomination entry
export interface CashDenomination {
  value: number;
  label: string;
  count: number;
}

// Interface for cash delivery
export interface CashDelivery {
  amount: number;
  recipient: string;
  note: string;
  date?: string;
}

// Save cash count to database
export const saveCashCount = async (
  banknotesTotal: number,
  coinsTotal: number,
  total: number,
  previousAmount: number,
  difference: number,
  note: string,
  countDate: string,
  denominations: CashDenomination[]
) => {
  try {
    // First insert the main cash count record
    const { data: kasaSayim, error: kasaError } = await supabase
      .from('kasa_sayim')
      .insert({
        banknot_toplami: banknotesTotal,
        bozuk_para_toplami: coinsTotal,
        toplam: total,
        onceki_miktar: previousAmount,
        fark: difference,
        notlar: note,
        tarih: new Date(countDate).toISOString(),
        kullanici_id: '00000000-0000-0000-0000-000000000000' // Placeholder user ID
      })
      .select()
      .single();

    if (kasaError) {
      console.error('Error saving cash count:', kasaError);
      throw new Error('Kasa sayımı kaydedilirken bir hata oluştu.');
    }

    // Now insert the denomination details
    const detaylar = denominations
      .filter(d => d.count > 0)
      .map(d => ({
        kasa_sayim_id: kasaSayim.id,
        para_tipi: d.value >= 5 ? 'banknot' : 'bozuk',
        deger: d.value,
        adet: d.count,
        toplam: d.value * d.count
      }));

    if (detaylar.length > 0) {
      const { error: detayError } = await supabase
        .from('kasa_sayim_detay')
        .insert(detaylar);

      if (detayError) {
        console.error('Error saving cash count details:', detayError);
        // The main record is already saved, so we don't throw here
      }
    }

    return kasaSayim;
  } catch (error) {
    console.error('Error in saveCashCount:', error);
    throw error;
  }
};

// Save cash delivery to database
export const saveCashDelivery = async (cashDelivery: CashDelivery) => {
  try {
    const { data, error } = await supabase
      .from('nakit_teslim')
      .insert({
        miktar: cashDelivery.amount,
        teslim_alan: cashDelivery.recipient,
        notlar: cashDelivery.note,
        tarih: cashDelivery.date ? new Date(cashDelivery.date).toISOString() : new Date().toISOString(),
        kullanici_id: '00000000-0000-0000-0000-000000000000' // Placeholder user ID
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving cash delivery:', error);
      throw new Error('Nakit teslimi kaydedilirken bir hata oluştu.');
    }

    return data;
  } catch (error) {
    console.error('Error in saveCashDelivery:', error);
    throw error;
  }
};

// Fetch previous cash deliveries
export const fetchPreviousCashDeliveries = async (limit: number = 5) => {
  try {
    const { data, error } = await supabase
      .from('nakit_teslim')
      .select('*')
      .order('tarih', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching previous deliveries:', error);
      throw new Error('Önceki teslimler yüklenirken bir hata oluştu.');
    }

    return data;
  } catch (error) {
    console.error('Error in fetchPreviousCashDeliveries:', error);
    throw error;
  }
};

// Fetch the latest cash count for the previous amount
export const fetchLatestCashCount = async () => {
  try {
    const { data, error } = await supabase
      .from('kasa_sayim')
      .select('*')
      .order('tarih', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('Error fetching latest cash count:', error);
      throw new Error('Son kasa sayımı yüklenirken bir hata oluştu.');
    }

    return data;
  } catch (error) {
    console.error('Error in fetchLatestCashCount:', error);
    throw error;
  }
};
