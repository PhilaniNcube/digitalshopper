import { Separator } from "@/components/ui/separator"

export default function ShippingPolicyPage() {
  return (
    <div className="container py-12 max-w-4xl min-h-[50vh]">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipping Policy</h1>
          <p className="text-muted-foreground mt-2">
            Information about our shipping methods, rates, and delivery times.
          </p>
        </div>
        <Separator />
        
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Delivery Process</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We process orders within 1-2 business days. Delivery times vary based on your location and the shipping method selected at checkout.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Shipping Rates & Estimates</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Shipping charges for your order will be calculated and displayed at checkout. 
              We partner with reliable courier services to ensure your high-precision hardware reaches you safely.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Order Tracking</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Once your order has shipped, you will receive an email notification with a tracking number. 
              You can use this number to check the status of your order on the courier's website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">International Shipping</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We offer international shipping to select countries. Please note that international orders may be subject to import duties and taxes, which are the responsibility of the customer.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
