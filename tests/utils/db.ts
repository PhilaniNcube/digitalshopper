import postgres from "postgres";

import { getEnvValue } from "./env";

function resolveDatabaseUrl() {
  return (
    getEnvValue("DATABASE_URL") ??
    getEnvValue("POSTGRES_URL") ??
    getEnvValue("POSTGRES_PRISMA_URL") ??
    getEnvValue("POSTGRES_URL_NON_POOLING") ??
    getEnvValue("NEON_DATABASE_URL") ??
    getEnvValue("NEON_DATABASE_URL_UNPOOLED")
  );
}

export type OrderRecord = {
  id: string;
  status: string;
  payfastPaymentId: string | null;
  paidAt: string | null;
};

export async function fetchOrderById(orderId: string): Promise<OrderRecord | null> {
  const connectionString = resolveDatabaseUrl();

  if (!connectionString) {
    throw new Error("Missing database connection string for Playwright test helper.");
  }

  const sql = postgres(connectionString, {
    prepare: false,
    max: 1,
  });

  try {
    const rows = await sql<OrderRecord[]>`
      select id, status, payfast_payment_id as "payfastPaymentId", paid_at as "paidAt"
      from orders
      where id = ${orderId}
      limit 1
    `;

    return rows[0] ?? null;
  } finally {
    await sql.end({ timeout: 5 });
  }
}