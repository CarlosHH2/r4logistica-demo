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
      operator_documents: {
        Row: {
          document_type: string
          file_name: string
          file_path: string
          id: string
          operator_id: string
          uploaded_at: string
        }
        Insert: {
          document_type: string
          file_name: string
          file_path: string
          id?: string
          operator_id: string
          uploaded_at?: string
        }
        Update: {
          document_type?: string
          file_name?: string
          file_path?: string
          id?: string
          operator_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_documents_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_vehicles: {
        Row: {
          brand: string
          color: string | null
          created_at: string
          id: string
          model: string
          operator_id: string
          plate: string
          updated_at: string
          year: number
        }
        Insert: {
          brand: string
          color?: string | null
          created_at?: string
          id?: string
          model: string
          operator_id: string
          plate: string
          updated_at?: string
          year: number
        }
        Update: {
          brand?: string
          color?: string | null
          created_at?: string
          id?: string
          model?: string
          operator_id?: string
          plate?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "operator_vehicles_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          birth_date: string
          created_at: string
          curp: string
          email: string
          id: string
          lastname: string
          name: string
          offer_source: string
          phone: string
          rfc: string
          second_lastname: string
          sex: string
          short_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          birth_date: string
          created_at?: string
          curp: string
          email: string
          id?: string
          lastname: string
          name: string
          offer_source: string
          phone: string
          rfc: string
          second_lastname: string
          sex: string
          short_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          birth_date?: string
          created_at?: string
          curp?: string
          email?: string
          id?: string
          lastname?: string
          name?: string
          offer_source?: string
          phone?: string
          rfc?: string
          second_lastname?: string
          sex?: string
          short_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          administrative_area: string
          country: Database["public"]["Enums"]["country_code"] | null
          created_at: string
          id: string
          int_number: string | null
          is_manual: boolean | null
          lat: number | null
          lng: number | null
          neighborhood: string
          notes: string | null
          number: string
          postal_code: string
          reference: string | null
          street: string
          sub_administrative_area: string
          updated_at: string
          user_id: string
        }
        Insert: {
          administrative_area: string
          country?: Database["public"]["Enums"]["country_code"] | null
          created_at?: string
          id?: string
          int_number?: string | null
          is_manual?: boolean | null
          lat?: number | null
          lng?: number | null
          neighborhood: string
          notes?: string | null
          number: string
          postal_code: string
          reference?: string | null
          street: string
          sub_administrative_area: string
          updated_at?: string
          user_id: string
        }
        Update: {
          administrative_area?: string
          country?: Database["public"]["Enums"]["country_code"] | null
          created_at?: string
          id?: string
          int_number?: string | null
          is_manual?: boolean | null
          lat?: number | null
          lng?: number | null
          neighborhood?: string
          notes?: string | null
          number?: string
          postal_code?: string
          reference?: string | null
          street?: string
          sub_administrative_area?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string | null
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
      country_code: "MX"
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
    Enums: {
      country_code: ["MX"],
    },
  },
} as const
