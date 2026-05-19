"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InvoiceButtonsProps {
  orderId: string;
}

export function InvoiceButtons({ orderId }: InvoiceButtonsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const toastId = toast.loading("Generating PDF invoice...");
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`);
      if (!response.ok) {
        throw new Error("Failed to generate invoice");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Invoice downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to download invoice.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmail = async () => {
    setIsSending(true);
    const toastId = toast.loading("Sending invoice email...");
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send email");
      }
      
      toast.success("Invoice emailed successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to email invoice.", { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleDownload}
        disabled={isDownloading || isSending}
        variant="outline"
        size="sm"
        className="bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700 hover:text-white"
      >
        {isDownloading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Download Invoice
      </Button>
      <Button
        onClick={handleEmail}
        disabled={isDownloading || isSending}
        variant="outline"
        size="sm"
        className="bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700 hover:text-white"
      >
        {isSending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Email Invoice
      </Button>
    </div>
  );
}
