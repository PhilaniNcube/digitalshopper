import { CheckoutForm } from "@/components/cart/checkout-form";

export default function CheckoutPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-12 lg:px-10 lg:py-16">
      <div className="space-y-3">
        <h1 className="font-display text-5xl font-semibold tracking-[-0.04em] text-white">
          Checkout
        </h1>
        
      </div>
      <CheckoutForm />
    </div>
  );
}
