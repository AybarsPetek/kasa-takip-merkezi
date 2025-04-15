export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      azalan_stok: {
        Row: {
          durum: string
          id: string
          kategori: string
          mevcut_stok: number
          minimum_stok: number
          urun_adi: string
        }
        Insert: {
          durum: string
          id?: string
          kategori: string
          mevcut_stok: number
          minimum_stok: number
          urun_adi: string
        }
        Update: {
          durum?: string
          id?: string
          kategori?: string
          mevcut_stok?: number
          minimum_stok?: number
          urun_adi?: string
        }
        Relationships: []
      }
      kasa_sayim: {
        Row: {
          banknot_toplami: number
          bozuk_para_toplami: number
          durum: string
          fark: number
          id: string
          kullanici_id: string
          notlar: string | null
          onceki_miktar: number
          tarih: string
          toplam: number
        }
        Insert: {
          banknot_toplami?: number
          bozuk_para_toplami?: number
          durum?: string
          fark?: number
          id?: string
          kullanici_id: string
          notlar?: string | null
          onceki_miktar?: number
          tarih?: string
          toplam?: number
        }
        Update: {
          banknot_toplami?: number
          bozuk_para_toplami?: number
          durum?: string
          fark?: number
          id?: string
          kullanici_id?: string
          notlar?: string | null
          onceki_miktar?: number
          tarih?: string
          toplam?: number
        }
        Relationships: []
      }
      kasa_sayim_detay: {
        Row: {
          adet: number
          deger: number
          id: string
          kasa_sayim_id: string
          para_tipi: string
          toplam: number
        }
        Insert: {
          adet: number
          deger: number
          id?: string
          kasa_sayim_id: string
          para_tipi: string
          toplam: number
        }
        Update: {
          adet?: number
          deger?: number
          id?: string
          kasa_sayim_id?: string
          para_tipi?: string
          toplam?: number
        }
        Relationships: [
          {
            foreignKeyName: "kasa_sayim_detay_kasa_sayim_id_fkey"
            columns: ["kasa_sayim_id"]
            isOneToOne: false
            referencedRelation: "kasa_sayim"
            referencedColumns: ["id"]
          },
        ]
      }
      nakit_teslim: {
        Row: {
          durum: string
          id: string
          kullanici_id: string
          miktar: number
          notlar: string | null
          tarih: string
          teslim_alan: string
        }
        Insert: {
          durum?: string
          id?: string
          kullanici_id: string
          miktar: number
          notlar?: string | null
          tarih?: string
          teslim_alan: string
        }
        Update: {
          durum?: string
          id?: string
          kullanici_id?: string
          miktar?: number
          notlar?: string | null
          tarih?: string
          teslim_alan?: string
        }
        Relationships: []
      }
      stok_rapor: {
        Row: {
          ad: string
          dosya_yolu: string | null
          durum: string
          id: string
          kategori: string
          kullanici_id: string
          tarih: string
          toplam_deger: number
          urun_sayisi: number
        }
        Insert: {
          ad: string
          dosya_yolu?: string | null
          durum?: string
          id?: string
          kategori?: string
          kullanici_id: string
          tarih: string
          toplam_deger?: number
          urun_sayisi?: number
        }
        Update: {
          ad?: string
          dosya_yolu?: string | null
          durum?: string
          id?: string
          kategori?: string
          kullanici_id?: string
          tarih?: string
          toplam_deger?: number
          urun_sayisi?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
