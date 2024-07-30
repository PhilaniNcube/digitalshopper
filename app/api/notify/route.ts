// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import formatter from '@/lib/currency';
import { Database } from '@/schema'
import { createClient } from '@/utils/supabase/server';
import { CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { NextResponse } from 'next/server'
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const dynamic = 'force-dynamic'




export async function POST(request: Request) {
  // Create a Supabase client configured to use cookies

      const cookieStore = cookies()


  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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



  const data = await request.text()

  console.log(data)

  let notificationArr = data.split('&')
  let obj: {
    [key: string]: string
  } = {}

  notificationArr.forEach((item) => {
    let arr = item.split('=')
    obj = {
      ...obj,
      [arr[0]]: arr[1]
    }
  })

  console.log({obj})

  const {pf_payment_id, payment_status, item_name} = obj

  const {data:order, error} = await supabase.from('orders').select('*').eq('id', item_name).single()

  if (error) {
    console.log(error)
    return NextResponse.json({ status: 200})
  } else if(order === null || payment_status !== 'COMPLETE') {
    return NextResponse.json({ status: 200})
  }  else if (payment_status === 'COMPLETE') {

    const {data:order, error} = await supabase.from('orders').update({paid: true, payment_id: pf_payment_id}).eq('id', item_name).select('*').single()

    if (error) {
      console.log(error)
      return NextResponse.json({ status: 200})
    }

    await resend.emails.send({
      from: 'Info <info@digitalshopper.co.za>',
      to: [order?.email],
      subject: 'Order Confirmation',
      html: `<div>
      <h1>Hi ${order?.first_name} ${order.last_name}</h1>
      <p>Thank you for your order. Your order has been received and is being processed.</p>
      <p>Here are the details of your order:</p>
      <ul>
       <li>Order Number: ${order?.id}</li>
       <li>Total: ${formatter(order?.total_amount)}</li>
       <li>Order Items:
         <ul>
           ${order.order_items.map((item) => (
              `<li>${item.product.title} : ${item.quantity} x ${formatter(item.product.price)}</li>`
           ))}
         </ul>
       </li>
      </ul>
      <p>Your order will be shipped to the following address:</p>
      <p>${order?.address}</p>
      <p>Thank you for your business!</p>
      <p>Kind Regards</p>
      <h2>Digital Shopper</h2>
      </div>`
    })

        await resend.emails.send({
      from: 'Info <info@digitalshopper.co.za>',
      to: ["ncbphi001@gmail.com"],
      subject: 'You have received a new order',
      html: `<div>
      <h1>Hi You have received a new order</h1>
      <p>Here are the details of the order:</p>
      <ul>
       <li>Order Number: ${order?.id}</li>
       <li>Name: ${order?.first_name} ${order.last_name}</li>
       <li>Address: ${order?.address}</li>
       <li>Total: ${formatter(order?.total_amount)}</li>
       <li>Order Items:
         <ul>
           ${order.order_items.map((item) => (
              `<li>${item.product.title} : ${item.quantity} x ${formatter(item.product.price)}</li>`
           ))}
         </ul>
       </li>
      </ul>

      <h2>Digital Shopper</h2>
      </div>`
    })

    return NextResponse.json({ status: 200})

  }

  // const {item_name, payment_status, pf_payment_id} = data

  // console.log({item_name, payment_status, pf_payment_id})

  // This assumes you have a `todos` table in Supabase. Check out
  // the `Create Table and seed with data` section of the README 👇
  // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md


  return NextResponse.json({ status: 200})
}
