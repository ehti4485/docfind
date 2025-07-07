export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          doctor_id: string
          date: string
          time: string
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          doctor_id: string
          date: string
          time: string
          status?: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          doctor_id?: string
          date?: string
          time?: string
          status?: string
          notes?: string | null
        }
      }
      doctors: {
        Row: {
          id: string
          created_at: string
          name: string
          specialty: string
          bio: string
          image_url: string | null
          availability: Json | null
          rating: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          specialty: string
          bio: string
          image_url?: string | null
          availability?: Json | null
          rating?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          specialty?: string
          bio?: string
          image_url?: string | null
          availability?: Json | null
          rating?: number | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          full_name: string
          avatar_url: string | null
          email: string
          phone: string | null
          address: string | null
          medical_history: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          full_name: string
          avatar_url?: string | null
          email: string
          phone?: string | null
          address?: string | null
          medical_history?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          full_name?: string
          avatar_url?: string | null
          email?: string
          phone?: string | null
          address?: string | null
          medical_history?: Json | null
        }
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
  }
}