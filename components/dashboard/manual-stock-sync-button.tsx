"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type SyncResponse = {
	ok: boolean;
	message?: string;
	result?: {
		updatedProductCount: number;
		updatedInventoryRows: number;
		unmatchedSkuCount: number;
	};
};

export function ManualStockSyncButton() {
	const [isPending, startTransition] = useTransition();

	function triggerSync() {
		startTransition(async () => {
			try {
				const response = await fetch("/api/cron/syntech-stock", {
					method: "GET",
					cache: "no-store",
				});

				const payload = (await response.json()) as SyncResponse;
				if (!response.ok || !payload.ok) {
					toast.error(payload.message ?? "Manual stock sync failed.");
					return;
				}

				const result = payload.result;
				if (result) {
					toast.success(
						`Synced ${result.updatedProductCount} products and ${result.updatedInventoryRows} warehouse rows.`,
					);
					return;
				}

				toast.success(payload.message ?? "Stock sync completed.");
			} catch {
				toast.error("Manual stock sync failed.");
			}
		});
	}

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onClick={triggerSync}
			disabled={isPending}
			className="border-surface-elevated text-white"
		>
			<RefreshCw className={isPending ? "size-3.5 animate-spin" : "size-3.5"} />
			{isPending ? "Syncing stock..." : "Sync stock now"}
		</Button>
	);
}
