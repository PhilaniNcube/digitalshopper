import { Separator } from "@/components/ui/separator"

export default function ReturnsPolicyPage() {
  return (
    <div className="container py-12 max-w-4xl min-h-[50vh]">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-muted-foreground mt-2">
            Details regarding our repair processes, return authorizations, and cancellation terms.
          </p>
        </div>
        <Separator />
        
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Repairs & Estimates</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Repair times provided are estimates and are not binding unless expressly agreed upon in writing. 
              We are not liable for any loss or damage resulting from unforeseen costs or delayed repairs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Return Material Authorization (RMA)</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li>No returns will be accepted without a valid RMA number.</li>
              <li>An RMA request form must be submitted online prior to returning any item for any reason.</li>
              <li>The RMA number authorizes the return of one item per number.</li>
              <li>A full fault description must be completed to enable our technical department to test and verify the fault.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Return Conditions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All defective merchandise must be returned with all original cables, power supplies, documentation, and packaging.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Shipping Costs & Liability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The customer is responsible for the cost of returning any products to our offices. 
              For your protection, please insure the package and ship via a traceable method. 
              We are not responsible for lost or damaged packages during transit.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Restocking Fees</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If any of the above conditions are not met, we reserve the right to refuse the return or charge a restocking fee of not less than 15%.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Incoming Acceptance</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We conduct incoming acceptance inspections as soon as possible upon receipt of products to verify their condition and the reported fault.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
