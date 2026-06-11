"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { trackBeginCheckout } from "@/lib/gtm";
import { getCartSubtotal, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { checkoutAction, type CheckoutState } from "@/dal/actions/checkout";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "At least 2 characters"),
  lastName: z.string().min(2, "At least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "At least 10 digits"),
  addressLine1: z.string().min(5, "At least 5 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "At least 2 characters"),
  province: z.string().min(2, "At least 2 characters"),
  postalCode: z.string().min(4, "At least 4 characters"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

function submitPayfastForm(paymentUrl: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentUrl;

  for (const [key, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

const initialState: CheckoutState = { success: false };

export function CheckoutForm() {
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const subtotal = getCartSubtotal(items);
  const shipping = subtotal >= 5000 ? 0 : 220;
  const total = subtotal + shipping;

  const [state, formAction, isPending] = useActionState(
    checkoutAction,
    initialState,
  );

  const {
    register,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
  });

  // Track begin_checkout on mount when there are items
  useEffect(() => {
    if (items.length > 0) {
      trackBeginCheckout(items, total);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect to Payfast after a successful server action
  useEffect(() => {
    if (state.success && state.paymentUrl && state.fields) {
      closeCart();
      submitPayfastForm(state.paymentUrl, state.fields);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, closeCart]);

  const serializedItems = JSON.stringify(
    items.map((item) => ({
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    })),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <form
        className="grid gap-5 rounded-none bg-surface-low p-6 ring-1 ring-white/5"
        action={formAction}
      >
        <input type="hidden" name="items" value={serializedItems} />

        <div className="grid gap-2 md:grid-cols-2">
          <Field
            data-invalid={!!(errors.firstName || state.fieldErrors?.firstName)}
          >
            <FieldLabel htmlFor="firstName" className='text-slate-100'>First name</FieldLabel>
            <Input id="firstName" className='h-12 rounded-none bg-white text-gray-900' {...register("firstName")} />
            <FieldError>
              {errors.firstName?.message ?? state.fieldErrors?.firstName?.[0]}
            </FieldError>
          </Field>
          <Field
            data-invalid={!!(errors.lastName || state.fieldErrors?.lastName)}
          >
            <FieldLabel htmlFor="lastName" className='text-slate-100'>Last name</FieldLabel>
            <Input id="lastName" className='h-12 rounded-none bg-white text-gray-900' {...register("lastName")} />
            <FieldError>
              {errors.lastName?.message ?? state.fieldErrors?.lastName?.[0]}
            </FieldError>
          </Field>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <Field data-invalid={!!(errors.email || state.fieldErrors?.email)}>
            <FieldLabel htmlFor="email" className='text-slate-100'>Email</FieldLabel>
            <Input id="email" type="email" className='h-12 rounded-none bg-white text-gray-900' {...register("email")} />
            <FieldError>
              {errors.email?.message ?? state.fieldErrors?.email?.[0]}
            </FieldError>
          </Field>
          <Field data-invalid={!!(errors.phone || state.fieldErrors?.phone)}>
            <FieldLabel htmlFor="phone" className='text-slate-100'>Phone</FieldLabel>
            <Input id="phone" className='h-12 rounded-none bg-white text-gray-900' {...register("phone")} />
            <FieldError>
              {errors.phone?.message ?? state.fieldErrors?.phone?.[0]}
            </FieldError>
          </Field>
        </div>

        <Field
          data-invalid={
            !!(errors.addressLine1 || state.fieldErrors?.addressLine1)
          }
        >
          <FieldLabel htmlFor="addressLine1" className='text-slate-100'>Address line 1</FieldLabel>
          <Input id="addressLine1" className='h-12 rounded-none bg-white text-gray-900' {...register("addressLine1")} />
          <FieldError>
            {errors.addressLine1?.message ??
              state.fieldErrors?.addressLine1?.[0]}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="addressLine2" className='text-slate-100'>Address line 2</FieldLabel>
          <Input id="addressLine2" className='h-12 rounded-none bg-white text-gray-900' {...register("addressLine2")} />
        </Field>

        <div className="grid gap-2 md:grid-cols-3">
          <Field data-invalid={!!(errors.city || state.fieldErrors?.city)}>
            <FieldLabel htmlFor="city" className='text-slate-100'>City</FieldLabel>
            <Input id="city" className='h-12 rounded-none bg-white text-gray-900' {...register("city")} />
            <FieldError>
              {errors.city?.message ?? state.fieldErrors?.city?.[0]}
            </FieldError>
          </Field>
          <Field
            data-invalid={!!(errors.province || state.fieldErrors?.province)}
          >
            <FieldLabel htmlFor="province" className='text-slate-100'>Province</FieldLabel>
            <Input id="province" className='h-12 rounded-none bg-white text-gray-900' {...register("province")} />
            <FieldError>
              {errors.province?.message ?? state.fieldErrors?.province?.[0]}
            </FieldError>
          </Field>
          <Field
            data-invalid={
              !!(errors.postalCode || state.fieldErrors?.postalCode)
            }
          >
            <FieldLabel htmlFor="postalCode" className='text-slate-100'>Postal code</FieldLabel>
            <Input id="postalCode" className='h-12 rounded-none bg-white text-gray-900' {...register("postalCode")} />
            <FieldError>
              {errors.postalCode?.message ?? state.fieldErrors?.postalCode?.[0]}
            </FieldError>
          </Field>
        </div>

        <Button
          className="bg-primary-strong! h-12 text-white rounded-none"
          type="submit"
          disabled={isPending || items.length === 0}
        >
          {isPending ? "Submitting..." : "Pay with Payfast"}
        </Button>
      </form>

      <div className="rounded-none bg-surface p-6 ring-1 ring-white/5">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Order summary
        </p>
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-medium text-white">{item.product.title}</p>
                <p className="text-slate-100">Qty {item.quantity}</p>
              </div>
              <p className="text-primary-strong">{formatCurrency(item.product.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 border-t border-white/5 pt-6 text-sm">
          <div className="flex items-center justify-between text-slate-100">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-100">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
          </div>
          <div className="flex items-center justify-between text-base text-primary-strong font-semibold">
            <span>Total</span>
            <span className="text-primary-strong">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
