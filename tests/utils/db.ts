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

export type OrderDependencyFixture = {
  orderId: string;
  dependentTableName: string;
  dependentRowCount: number;
  email: string;
};

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function withDatabase<T>(callback: (sql: postgres.Sql) => Promise<T>) {
  const connectionString = resolveDatabaseUrl();

  if (!connectionString) {
    throw new Error("Missing database connection string for Playwright test helper.");
  }

  const sql = postgres(connectionString, {
    prepare: false,
    max: 1,
  });

  try {
    return await callback(sql);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

export async function fetchOrderById(orderId: string): Promise<OrderRecord | null> {
  return withDatabase(async (sql) => {
    const rows = await sql<OrderRecord[]>`
      select id, status, payfast_payment_id as "payfastPaymentId", paid_at as "paidAt"
      from orders
      where id = ${orderId}
      limit 1
    `;

    return rows[0] ?? null;
  });
}

export async function createOrderWithDependentRow(seed: string): Promise<OrderDependencyFixture> {
  const normalizedSeed = `${seed}${Math.random().toString(36).slice(2, 8)}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const suffix = normalizedSeed.slice(0, 24) || "fixture";
  const dependentTableName = `order_test_dependents_${suffix}`;
  const email = `order-delete-${suffix}@example.com`;

  return withDatabase(async (sql) => {
    await sql.unsafe(`
      create table if not exists public.${quoteIdentifier(dependentTableName)} (
        id uuid primary key default gen_random_uuid(),
        order_id uuid not null references public.orders(id),
        created_at timestamp with time zone not null default now()
      )
    `);

    await sql.unsafe(`truncate table public.${quoteIdentifier(dependentTableName)}`);

    const [order] = await sql<{ id: string }[]>`
      insert into orders (
        first_name,
        last_name,
        email,
        phone,
        address_line_1,
        city,
        province,
        postal_code,
        items,
        subtotal,
        shipping,
        total,
        status
      )
      values (
        'Delete',
        'Target',
        ${email},
        '0123456789',
        '123 Example Street',
        'Cape Town',
        'Western Cape',
        '8001',
        '[]'::jsonb,
        1000,
        0,
        1000,
        'pending'
      )
      returning id
    `;

    await sql.unsafe(
      `insert into public.${quoteIdentifier(dependentTableName)} (order_id) values ($1)`,
      [order.id],
    );

    const [{ count }] = await sql.unsafe<{ count: number }[]>(
      `select count(*)::int as count from public.${quoteIdentifier(dependentTableName)}`,
    );

    return {
      orderId: order.id,
      dependentTableName,
      dependentRowCount: count,
      email,
    };
  });
}

export async function fetchDependentRowCount(tableName: string, orderId: string): Promise<number> {
  return withDatabase(async (sql) => {
    const rows = await sql.unsafe<{ count: number }[]>(
      `select count(*)::int as count from public.${quoteIdentifier(tableName)} where order_id = $1`,
      [orderId],
    );

    return rows[0]?.count ?? 0;
  });
}

export async function dropOrderDependencyTable(tableName: string) {
  await withDatabase(async (sql) => {
    await sql.unsafe(`drop table if exists public.${quoteIdentifier(tableName)}`);
  });
}

export async function deleteOrderById(orderId: string) {
  await withDatabase(async (sql) => {
    await sql`delete from orders where id = ${orderId}`;
  });
}