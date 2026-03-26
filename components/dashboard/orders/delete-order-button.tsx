"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteOrderAction } from "@/dal/actions/orders";
import type { OrderListItem } from "@/dal/queries/orders";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type DeleteOrderButtonProps = {
	order: OrderListItem;
};

export function DeleteOrderButton({ order }: DeleteOrderButtonProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const customerName = `${order.firstName} ${order.lastName}`;

	function handleDelete() {
		startTransition(async () => {
			const result = await deleteOrderAction(order.id);

			if (!result.success) {
				toast.error(result.message);
				return;
			}

			setOpen(false);
			toast.success(result.message);
			router.refresh();
		});
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive"
					size="sm"
					disabled={isPending}
					className="min-w-20"
				>
					{isPending ? <Spinner className="size-3.5" /> : <Trash2 className="size-3.5" />}
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete this order?</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently remove the order for {customerName}. This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<Button variant="destructive" onClick={handleDelete} disabled={isPending}>
						{isPending ? <Spinner className="size-4" /> : null}
						{isPending ? "Deleting..." : "Delete order"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}