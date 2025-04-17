
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

// Interface for cash count history item
export interface CashCountHistoryItem {
  id: string;
  banknot_toplami: number;
  bozuk_para_toplami: number;
  toplam: number;
  onceki_miktar: number;
  fark: number;
  notlar: string | null;
  tarih: string;
  kullanici_id: string;
  durum: string;
}

// Interface for cash delivery history item
export interface CashDeliveryHistoryItem {
  id: string;
  miktar: number;
  teslim_alan: string;
  notlar: string | null;
  tarih: string;
  kullanici_id: string;
  durum: string;
}

// Interface for cash count detail item
export interface CashCountDetailItem {
  id: string;
  kasa_sayim_id: string;
  para_tipi: 'banknot' | 'bozuk';
  deger: number;
  adet: number;
  toplam: number;
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

// Fetch cash count history with pagination
export const fetchCashCountHistory = async (page: number = 1, pageSize: number = 10) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const { data, error, count } = await supabase
      .from('kasa_sayim')
      .select('*', { count: 'exact' })
      .order('tarih', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching cash count history:', error);
      throw new Error('Kasa sayım geçmişi yüklenirken bir hata oluştu.');
    }

    return { data, count: count || 0 };
  } catch (error) {
    console.error('Error in fetchCashCountHistory:', error);
    throw error;
  }
};

// Fetch cash delivery history with pagination
export const fetchCashDeliveryHistory = async (page: number = 1, pageSize: number = 10) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const { data, error, count } = await supabase
      .from('nakit_teslim')
      .select('*', { count: 'exact' })
      .order('tarih', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching cash delivery history:', error);
      throw new Error('Nakit teslim geçmişi yüklenirken bir hata oluştu.');
    }

    return { data, count: count || 0 };
  } catch (error) {
    console.error('Error in fetchCashDeliveryHistory:', error);
    throw error;
  }
};

// Fetch details of a specific cash count
export const fetchCashCountDetails = async (cashCountId: string) => {
  try {
    // First get the cash count main record
    const { data: cashCount, error: countError } = await supabase
      .from('kasa_sayim')
      .select('*')
      .eq('id', cashCountId)
      .single();

    if (countError) {
      console.error('Error fetching cash count:', countError);
      throw new Error('Kasa sayım detayları yüklenirken bir hata oluştu.');
    }

    // Then get the denomination details
    const { data: details, error: detailsError } = await supabase
      .from('kasa_sayim_detay')
      .select('*')
      .eq('kasa_sayim_id', cashCountId);

    if (detailsError) {
      console.error('Error fetching cash count details:', detailsError);
      throw new Error('Kasa sayım detayları yüklenirken bir hata oluştu.');
    }

    return { cashCount, details };
  } catch (error) {
    console.error('Error in fetchCashCountDetails:', error);
    throw error;
  }
};
