import {z} from 'zod';

export const envSchema = z.object({
	NEXT_PUBLIC_SUPABASE_URL: z.string(),
	NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
	DATABASE_PASSWORD: z.string(),
	SUPABASE_SERVICE_ROLE_KEY: z.string(),
	NEXT_PUBLIC_PAYFAST_URL: z.string(),
	NEXT_PUBLIC_MERCHANT_ID: z.string(),
	NEXT_PUBLIC_MERCHANT_KEY: z.string(),
	NEXT_PUBLIC_PASSPHRASE: z.string(),
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	CLERK_SECRET_KEY: z.string(),
	OPENAI_API_KEY: z.string(),
	NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
	NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
	NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
	NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),
	NEXT_PUBLIC_SITE_URL: z.string(),
	NEXT_PUBLIC_RESEND_API_KEY: z.string(),

});

envSchema.safeParse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {
    }
  }
}
