import { CartItem } from "./interfaces"

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
      admins: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      brands: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          image_url: string
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      colour: {
        Row: {
          colour_name: string
          created_at: string
          id: string
        }
        Insert: {
          colour_name: string
          created_at?: string
          id?: string
        }
        Update: {
          colour_name?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          order_items: {
            product: Database['public']['Tables']['products']['Row']
            quantity: number
            variant: string
          }[]
          phone: string
          postal_code: string
          profile_id: string | null
          province: string
          paid: boolean
          shipped: boolean
          payment_id: string | null
          subtotal: number
          shipping: number
          total_amount: number
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          order_items: {
            product: Database['public']['Tables']['products']['Row']
            quantity: number
            variant: string
          }[]
          phone: string
          postal_code: string
          profile_id?: string | null
          province: string
          paid?: boolean
          shipped?: boolean
          payment_id?: string | null
          subtotal: number
          shipping: number
          total_amount: number
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          order_items?: {
            product: Database['public']['Tables']['products']['Row']
            quantity: number
            variant: string
          }[]
          phone?: string
          postal_code?: string
          profile_id?: string | null
          province?: string
          paid?: boolean
          shipped?: boolean
          payment_id?: string | null
          subtotal?: number
          shipping?: number
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      product_brands: {
        Row: {
          brand_id: string
          created_at: string
          product_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          product_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_brands_brand_id_fkey"
            columns: ["brand_id"]
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_brands_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_categories: {
        Row: {
          category_id: Database['public']['Tables']['categories']['Row']
          created_at: string
          product_id: Database['public']['Tables']['products']['Row']
        }
        Insert: {
          category_id: string
          created_at?: string
          product_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_subcategories: {
        Row: {
          created_at: string
          product_id: Database['public']['Tables']['products']['Row']
          subcategory_id: Database['public']['Tables']['sub_categories']['Row']
        }
        Insert: {
          created_at?: string
          product_id: string
          subcategory_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          subcategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_subcategories_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_subcategories_subcategory_id_fkey"
            columns: ["subcategory_id"]
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      product_tags: {
        Row: {
          created_at: string
         product_id: Database['public']['Tables']['products']['Row']
          tag_id: Database['public']['Tables']['tags']['Row']
        }
        Insert: {
          created_at?: string
          product_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
          Row: {
          attributes: {key:string, value:string}[] | null
          brand: Database['public']['Tables']['brands']['Row']
          category: Database['public']['Tables']['categories']['Row']
          gender?: "men" | "women" | "unisex" | null
          created_at: string
          description: string
          id: string
          images: string[]
          price: number
          slug: string
          sub_category: Database['public']['Tables']['sub_categories']['Row']
          title: string
          has_variants: boolean
          variants: {
            variant_name: string
            variant_value: string
          }[] | null
          featured: boolean
          instock: boolean
          frame_style?: string | null

        }
       Insert: {
          attributes?: {key:string, value:string}[] | null
          brand: string
          category: string

          created_at?: string
          description: string
          id?: string
          images: string[] | null
          price?: number
          gender?: string | null
          slug: string
          sub_category: string
          title: string
          has_variants?: boolean
          variants?: {
            variant_name: string
            variant_value: string
          }[] | null
          featured?: boolean
          instock?: boolean
          frame_style?: string | null

        }
    Update: {
          attributes?: {key:string, value:string}[] | null
          brand?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          images?: string[] | null
          price?: number
          slug?: string
          sub_category?: string
          title?: string
          has_variants?: boolean
          variants?: {
            variant_name: string
            variant_value: string
          }[] | null
           featured?: boolean
          instock?: boolean
          frame_style?: string | null
          gender?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_fkey"
            columns: ["brand"]
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_fkey"
            columns: ["category"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_sub_category_fkey"
            columns: ["sub_category"]
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at: string
        }
        Insert: {
          email?: string
          first_name?: string
          id: string
          last_name?: string
          updated_at?: string
        }
        Update: {
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      size: {
        Row: {
          created_at: string
          id: string
          size_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          size_name: string
        }
        Update: {
          created_at?: string
          id?: string
          size_name?: string
        }
        Relationships: []
      }
      sub_categories: {
        Row: {
          category: Database['public']['Tables']['categories']['Row']
          created_at: string
          id: string
          image_url: string
          slug: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          image_url: string
          slug: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          image_url?: string
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_category_fkey"
            columns: ["category"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      frame_styles: {
        Row: {
          id: string
          created_at: string
          title: string
          slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          slug: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          slug?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          image_url: string
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

