
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // CORS kontrolü
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      // Bu değerler otomatik olarak Edge Function içerisinde erişilebilir
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verileri sıfırlama işlemleri
    // KasaSayimDetay tablosunu temizle
    await supabaseClient.from('kasa_sayim_detay').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log("KasaSayimDetay tablosu temizlendi")
    
    // NakitTeslim tablosunu temizle
    await supabaseClient.from('nakit_teslim').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log("NakitTeslim tablosu temizlendi")
    
    // KasaSayim tablosunu temizle
    await supabaseClient.from('kasa_sayim').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log("KasaSayim tablosu temizlendi")
    
    // StokRapor tablosunu temizle
    await supabaseClient.from('stok_rapor').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log("StokRapor tablosu temizlendi")
    
    // AzalanStok tablosunu temizle
    await supabaseClient.from('azalan_stok').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log("AzalanStok tablosu temizlendi")

    return new Response(
      JSON.stringify({ success: true, message: 'Tüm veriler başarıyla sıfırlandı' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Veri sıfırlama hatası:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
