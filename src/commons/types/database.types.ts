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
      config_plans: {
        Row: {
          billing_period: string | null
          created_at: string | null
          description: string | null
          history_retention_days: number | null
          id: string
          is_active: boolean | null
          max_procedures: number | null
          max_users: number | null
          mp_plan_id: string
          name: string
          price: number
          slug: string
          updated_at: string | null
        }
        Insert: {
          billing_period?: string | null
          created_at?: string | null
          description?: string | null
          history_retention_days?: number | null
          id?: string
          is_active?: boolean | null
          max_procedures?: number | null
          max_users?: number | null
          mp_plan_id: string
          name: string
          price: number
          slug: string
          updated_at?: string | null
        }
        Update: {
          billing_period?: string | null
          created_at?: string | null
          description?: string | null
          history_retention_days?: number | null
          id?: string
          is_active?: boolean | null
          max_procedures?: number | null
          max_users?: number | null
          mp_plan_id?: string
          name?: string
          price?: number
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          birthday: string | null
          created_at: string | null
          email: string | null
          establishment_id: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          birthday?: string | null
          created_at?: string | null
          email?: string | null
          establishment_id: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          birthday?: string | null
          created_at?: string | null
          email?: string | null
          establishment_id?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_blocks: {
        Row: {
          created_at: string | null
          date: string | null
          day_of_week: number | null
          end_time: string
          establishment_id: string
          id: string
          reason: string | null
          recurring_type: number
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          day_of_week?: number | null
          end_time: string
          establishment_id: string
          id?: string
          reason?: string | null
          recurring_type?: number
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          day_of_week?: number | null
          end_time?: string
          establishment_id?: string
          id?: string
          reason?: string | null
          recurring_type?: number
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_blocks_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string
          opening_hours: Json | null
          owner_id: string
          phone: string | null
          slug: string
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name: string
          opening_hours?: Json | null
          owner_id: string
          phone?: string | null
          slug: string
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          opening_hours?: Json | null
          owner_id?: string
          phone?: string | null
          slug?: string
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          establishment_id: string | null
          id: string
          mp_invoice_id: string
          mp_payer_email: string | null
          mp_payer_id: number | null
          mp_preapproval_id: string | null
          mp_subscription_id: string | null
          paid_at: string | null
          raw_payload: Json | null
          status: string | null
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          establishment_id?: string | null
          id?: string
          mp_invoice_id: string
          mp_payer_email?: string | null
          mp_payer_id?: number | null
          mp_preapproval_id?: string | null
          mp_subscription_id?: string | null
          paid_at?: string | null
          raw_payload?: Json | null
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          establishment_id?: string | null
          id?: string
          mp_invoice_id?: string
          mp_payer_email?: string | null
          mp_payer_id?: number | null
          mp_preapproval_id?: string | null
          mp_subscription_id?: string | null
          paid_at?: string | null
          raw_payload?: Json | null
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      procedures: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number
          establishment_id: string
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration: number
          establishment_id: string
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number
          establishment_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      schedule_procedures: {
        Row: {
          duration_at_time: number
          price_at_time: number
          procedure_id: string
          schedule_id: string
        }
        Insert: {
          duration_at_time: number
          price_at_time: number
          procedure_id: string
          schedule_id: string
        }
        Update: {
          duration_at_time?: number
          price_at_time?: number
          procedure_id?: string
          schedule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_procedures_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_procedures_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string | null
          customer_id: string
          end_at: string
          establishment_id: string
          id: string
          notes: string | null
          start_at: string
          status: number
          total_duration: number
          total_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          end_at: string
          establishment_id: string
          id?: string
          notes?: string | null
          start_at: string
          status?: number
          total_duration: number
          total_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          end_at?: string
          establishment_id?: string
          id?: string
          notes?: string | null
          start_at?: string
          status?: number
          total_duration?: number
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_inconsistencies: {
        Row: {
          created_at: string | null
          id: string
          issue_reason: string | null
          mp_payer_id: number | null
          mp_preapproval_id: string
          payer_email_received: string | null
          payment: string | null
          preapproval_data: Json | null
          resolved: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          issue_reason?: string | null
          mp_payer_id?: number | null
          mp_preapproval_id: string
          payer_email_received?: string | null
          payment?: string | null
          preapproval_data?: Json | null
          resolved?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          issue_reason?: string | null
          mp_payer_id?: number | null
          mp_preapproval_id?: string
          payer_email_received?: string | null
          payment?: string | null
          preapproval_data?: Json | null
          resolved?: boolean | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          base_value: number
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          extra_user_price: number | null
          extra_users_count: number | null
          id: string
          mp_payer_email: string | null
          mp_payer_id: number | null
          mp_preapproval_plan_id: string | null
          mp_status: string
          mp_subscription_id: string | null
          plan_name: string | null
          updated_at: string | null
        }
        Insert: {
          base_value: number
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          extra_user_price?: number | null
          extra_users_count?: number | null
          id?: string
          mp_payer_email?: string | null
          mp_payer_id?: number | null
          mp_preapproval_plan_id?: string | null
          mp_status?: string
          mp_subscription_id?: string | null
          plan_name?: string | null
          updated_at?: string | null
        }
        Update: {
          base_value?: number
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          extra_user_price?: number | null
          extra_users_count?: number | null
          id?: string
          mp_payer_email?: string | null
          mp_payer_id?: number | null
          mp_preapproval_plan_id?: string | null
          mp_status?: string
          mp_subscription_id?: string | null
          plan_name?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "public">

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
