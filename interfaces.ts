import { Database } from "./schema";

export interface CartProduct {
  product: Database['public']['Tables']['products']['Row']
  selectedVariant:string
}

export interface CartItem {
  product: CartProduct
  qty: number
}

export interface PayfastData {
  hash: string
  string: string
  data: {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first: string
  name_last: string
  email_address: string
  cell_number: string
  amount: string
  item_name: string
  custom_str1: string
  custom_str2: string
  }

}
