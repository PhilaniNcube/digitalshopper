"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

const deleteOrderSchema = z.object({
	orderId: z.string().uuid("Invalid order id."),
});

type OrderDependency = {
	schemaName: string;
	tableName: string;
	columnName: string;
};

export type DeleteOrderActionResult = {
	success: boolean;
	message: string;
	deletedDependentRows?: number;
};

function quoteIdentifier(identifier: string) {
	return `"${identifier.replaceAll('"', '""')}"`;
}

async function getOrderDependencies(transaction: typeof sql) {
	return transaction<OrderDependency[]>`
		select
			child_ns.nspname as "schemaName",
			child_cls.relname as "tableName",
			child_att.attname as "columnName"
		from pg_constraint constraint_def
		join pg_class child_cls on child_cls.oid = constraint_def.conrelid
		join pg_namespace child_ns on child_ns.oid = child_cls.relnamespace
		join pg_class parent_cls on parent_cls.oid = constraint_def.confrelid
		join pg_namespace parent_ns on parent_ns.oid = parent_cls.relnamespace
		join unnest(constraint_def.conkey) with ordinality as child_col(attnum, ordinality) on true
		join unnest(constraint_def.confkey) with ordinality as parent_col(attnum, ordinality)
			on parent_col.ordinality = child_col.ordinality
		join pg_attribute child_att
			on child_att.attrelid = constraint_def.conrelid
			and child_att.attnum = child_col.attnum
		join pg_attribute parent_att
			on parent_att.attrelid = constraint_def.confrelid
			and parent_att.attnum = parent_col.attnum
		where constraint_def.contype = 'f'
			and parent_ns.nspname = 'public'
			and parent_cls.relname = 'orders'
			and parent_att.attname = 'id'
	`;
}

export async function deleteOrderAction(orderId: string): Promise<DeleteOrderActionResult> {
	await requireAdmin();

	const parsedInput = deleteOrderSchema.safeParse({ orderId });

	if (!parsedInput.success) {
		return {
			success: false,
			message: parsedInput.error.issues[0]?.message ?? "Invalid order id.",
		};
	}

	try {
		const deletedDependentRows = await sql.begin(async (transaction) => {
			const dependencies = await getOrderDependencies(transaction);
			let totalDeletedRows = 0;

			for (const dependency of dependencies) {
				const tableName = `${quoteIdentifier(dependency.schemaName)}.${quoteIdentifier(dependency.tableName)}`;
				const columnName = quoteIdentifier(dependency.columnName);
				const deletedRows = await transaction.unsafe<{ deleted: number }[]>(
					`delete from ${tableName} where ${columnName} = $1 returning 1 as deleted`,
					[parsedInput.data.orderId],
				);

				totalDeletedRows += deletedRows.length;
			}

			const [deletedOrder] = await transaction<{ id: string }[]>`
				delete from "orders"
				where "id" = ${parsedInput.data.orderId}
				returning "id"
			`;

			if (!deletedOrder) {
				throw new Error("ORDER_NOT_FOUND");
			}

			return totalDeletedRows;
		});

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/orders");
		revalidatePath("/dashboard/payments");
		revalidatePath("/dashboard/shipping");

		return {
			success: true,
			message: "Order deleted successfully.",
			deletedDependentRows,
		};
	} catch (error) {
		if (error instanceof Error && error.message === "ORDER_NOT_FOUND") {
			return {
				success: false,
				message: "Order not found.",
			};
		}

		console.error("Failed to delete order", error);

		return {
			success: false,
			message: "Unable to delete the order right now.",
		};
	}
}