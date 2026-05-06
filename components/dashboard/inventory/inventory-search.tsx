"use client";

import { useQueryState, parseAsString } from "nuqs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function InventorySearch() {
	const [q, setQ] = useQueryState(
		"q",
		parseAsString.withDefault("").withOptions({
			shallow: false,
			throttleMs: 300,
		}),
	);

	return (
		<div className="relative max-w-md">
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
			<Input
				placeholder="Search catalog by title or SKU..."
				value={q}
				onChange={(e) => setQ(e.target.value)}
				className="h-12 pl-10 placeholder:text-white/30"
			/>
		</div>
	);
}
