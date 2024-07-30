import { Database } from '@/schema'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import md5 from 'crypto-js/md5'
import { CookieOptions, createServerClient } from '@supabase/ssr'




export const dynamic = 'force-dynamic'


export async function GET( request: Request,
  { params }: { params: { id: string } }) {

    const id = params.id

    const cookieStore = cookies()


  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    })


  const { data: order, error } = await supabase.from('orders').select('*').eq('id', id).single()

  if (error) {
    return NextResponse.json({
      message: error.message,
      data: null,
      status: 404
    })
  }

  return NextResponse.json({
    message: 'Order found',
    data: order,
    status: 200
  })
}


export async function POST(request: Request,
  { params }: { params: { id: string } }){

  const id = params.id

  const data = await request.json()

  let passphrase= process.env.NEXT_PUBLIC_PASSPHRASE
  let merchant_id = process.env.NEXT_PUBLIC_MERCHANT_ID
  let merchant_key = process.env.NEXT_PUBLIC_MERCHANT_KEY
  let return_url = `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${id}/success`
  let cancel_url = `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${id}/cancel`
  let notify_url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/notify?order_id=${id}`
  let name_first = data.first_name
  let name_last = data.last_name
  let email_address = data.email
  let cell_number = data.phone
  let amount = data.total_amount.toFixed(2)
  let item_name = id
  let custom_str1 = data.address
  let custom_str2 = data.city

  // generate a string with keys and values separated by & with the key ste to the name of the variable in alphbetical order
  let string = `merchant_id=${merchant_id}&merchant_key=${merchant_key}&return_url=${return_url}&cancel_url=${cancel_url}&notify_url=${notify_url}&name_first=${name_first}&name_last=${name_last}&email_address=${email_address}&cell_number=${cell_number}&amount=${amount}&item_name=${item_name}&custom_str1=${custom_str1}&custom_str2=${custom_str2}`


  // generate a MD5 hash of the string

  let hash = md5(string).toString()


  // create a new string with the hash appended to the end
  let new_string = `${string}&hash=${hash}`



  return NextResponse.json({
    string: new_string,
    hash: hash,
    data: {
      merchant_id: merchant_id,
      merchant_key: merchant_key,
      return_url: return_url,
      cancel_url: cancel_url,
      notify_url: notify_url,
      name_first: name_first,
      name_last: name_last,
      email_address: email_address,
      cell_number: cell_number,
      amount: amount,
      item_name: item_name,
      custom_str1: custom_str1,
      custom_str2: custom_str2,
    }
  })

  }
