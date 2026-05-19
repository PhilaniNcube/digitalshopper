import React from "react";
import { NextResponse } from "next/server";
import { getOrderById } from "@/dal/queries/orders";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/components/dashboard/orders/invoice-pdf";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const pdfBuffer = await renderToBuffer(React.createElement(InvoiceDocument, { order }) as any);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const pdfBuffer = await renderToBuffer(React.createElement(InvoiceDocument, { order }) as any);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Digital Shopper <onboarding@resend.dev>", // Replace with your verified domain
      to: order.email,
      subject: `Your Invoice for Order #${order.id}`,
      text: `Hi ${order.firstName},\n\nPlease find attached the invoice for your recent order #${order.id}.\n\nThank you for shopping with us!\n\nBest regards,\nDigital Shopper Team`,
      attachments: [
        {
          filename: `invoice-${order.id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error emailing invoice PDF:", error);
    return NextResponse.json(
      { error: "Failed to email PDF" },
      { status: 500 }
    );
  }
}
