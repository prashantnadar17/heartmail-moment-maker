export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      cards: {
        Row: {
          created_at: string
          draft_id: string
          expires_at: string | null
          id: string
          mode: string
          order_id: string
          public_token: string
          published_at: string
          revoked_at: string | null
          status: string
          token_hash: string
        }
        Insert: {
          created_at?: string
          draft_id: string
          expires_at?: string | null
          id?: string
          mode?: string
          order_id: string
          public_token: string
          published_at?: string
          revoked_at?: string | null
          status?: string
          token_hash: string
        }
        Update: {
          created_at?: string
          draft_id?: string
          expires_at?: string | null
          id?: string
          mode?: string
          order_id?: string
          public_token?: string
          published_at?: string
          revoked_at?: string | null
          status?: string
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      drafts: {
        Row: {
          created_at: string
          deliver_at: string | null
          expires_at: string
          id: string
          owner_id: string | null
          personalization: Json
          session_reference: string
          status: string
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deliver_at?: string | null
          expires_at?: string
          id?: string
          owner_id?: string | null
          personalization?: Json
          session_reference: string
          status?: string
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deliver_at?: string | null
          expires_at?: string
          id?: string
          owner_id?: string | null
          personalization?: Json
          session_reference?: string
          status?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drafts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          discount_amount_paise: number
          draft_id: string
          final_amount_paise: number
          id: string
          mode: string
          original_amount_paise: number
          payment_provider: string
          provider_order_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          discount_amount_paise?: number
          draft_id: string
          final_amount_paise: number
          id?: string
          mode?: string
          original_amount_paise: number
          payment_provider?: string
          provider_order_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          discount_amount_paise?: number
          draft_id?: string
          final_amount_paise?: number
          id?: string
          mode?: string
          original_amount_paise?: number
          payment_provider?: string
          provider_order_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_paise: number
          created_at: string
          currency: string
          id: string
          mode: string
          order_id: string
          provider_payment_id: string
          provider_signature: string | null
          status: string
          verified_at: string | null
        }
        Insert: {
          amount_paise: number
          created_at?: string
          currency?: string
          id?: string
          mode?: string
          order_id: string
          provider_payment_id: string
          provider_signature?: string | null
          status?: string
          verified_at?: string | null
        }
        Update: {
          amount_paise?: number
          created_at?: string
          currency?: string
          id?: string
          mode?: string
          order_id?: string
          provider_payment_id?: string
          provider_signature?: string | null
          status?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          base_price_paise: number
          category_id: string | null
          configuration: Json
          created_at: string
          currency: string
          description: string | null
          discount_amount_paise: number
          experience_type: string
          id: string
          is_active: boolean
          is_featured: boolean
          is_new: boolean
          name: string
          popularity: number
          slug: string
          sort_order: number
          tagline: string | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          base_price_paise: number
          category_id?: string | null
          configuration?: Json
          created_at?: string
          currency?: string
          description?: string | null
          discount_amount_paise?: number
          experience_type: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_new?: boolean
          name: string
          popularity?: number
          slug: string
          sort_order?: number
          tagline?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          base_price_paise?: number
          category_id?: string | null
          configuration?: Json
          created_at?: string
          currency?: string
          description?: string | null
          discount_amount_paise?: number
          experience_type?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_new?: boolean
          name?: string
          popularity?: number
          slug?: string
          sort_order?: number
          tagline?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_display_name: string
          content: string
          created_at: string
          id: string
          is_approved: boolean
          location: string | null
          rating: number
        }
        Insert: {
          author_display_name: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean
          location?: string | null
          rating: number
        }
        Update: {
          author_display_name?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          location?: string | null
          rating?: number
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          event_id: string
          id: string
          payload: Json | null
          processed_at: string
          provider: string
        }
        Insert: {
          event_id: string
          id?: string
          payload?: Json | null
          processed_at?: string
          provider: string
        }
        Update: {
          event_id?: string
          id?: string
          payload?: Json | null
          processed_at?: string
          provider?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
