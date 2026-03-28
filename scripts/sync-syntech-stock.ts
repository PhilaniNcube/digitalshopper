import { getSyntechStockFeedPreview, syncSyntechStockUpdateFeed } from "../lib/syntech-stock-sync";

type SyncOptions = {
	feedPath?: string;
	limit?: number;
	dryRun: boolean;
	intervalMinutes?: number;
};

function parseArgs(argv: string[]): SyncOptions {
	const options: SyncOptions = {
		feedPath: process.env.SYNTECH_STOCK_FEED_PATH,
		dryRun: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];

		if (argument === "--dry-run") {
			options.dryRun = true;
			continue;
		}

		if (argument === "--feed-path") {
			options.feedPath = argv[index + 1];
			index += 1;
			continue;
		}

		if (argument.startsWith("--feed-path=")) {
			options.feedPath = argument.slice("--feed-path=".length);
			continue;
		}

		if (argument === "--limit") {
			options.limit = Number.parseInt(argv[index + 1] ?? "", 10);
			index += 1;
			continue;
		}

		if (argument.startsWith("--limit=")) {
			options.limit = Number.parseInt(argument.slice("--limit=".length), 10);
			continue;
		}

		if (argument === "--interval-minutes") {
			options.intervalMinutes = Number.parseInt(argv[index + 1] ?? "", 10);
			index += 1;
			continue;
		}

		if (argument.startsWith("--interval-minutes=")) {
			options.intervalMinutes = Number.parseInt(argument.slice("--interval-minutes=".length), 10);
		}
	}

	if (options.limit !== undefined && (!Number.isFinite(options.limit) || options.limit <= 0)) {
		throw new Error("--limit must be a positive integer.");
	}

	if (
		options.intervalMinutes !== undefined &&
		(!Number.isFinite(options.intervalMinutes) || options.intervalMinutes <= 0)
	) {
		throw new Error("--interval-minutes must be a positive integer.");
	}

	return options;
}

function sleep(milliseconds: number) {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, milliseconds);
	});
}

async function runSync(options: SyncOptions) {
	if (options.dryRun) {
		const preview = await getSyntechStockFeedPreview({
			feedPath: options.feedPath,
			limit: options.limit,
		});

		console.log(
			JSON.stringify(
				preview,
				null,
				2,
			),
		);
		return;
	}

	const result = await syncSyntechStockUpdateFeed({
		feedPath: options.feedPath,
		limit: options.limit,
	});

	console.log(
		`Stock sync complete: ${result.updatedProductCount} products updated, ${result.updatedInventoryRows} warehouse rows updated, ${result.unmatchedSkuCount} unmatched SKUs.` +
			(result.declaredCount ? ` Supplier reported ${result.declaredCount} feed rows.` : ""),
	);
}

async function main() {
	const options = parseArgs(process.argv.slice(2));

	if (!options.intervalMinutes) {
		await runSync(options);
		return;
	}

	let shouldStop = false;
	for (const signal of ["SIGINT", "SIGTERM"] as const) {
		process.on(signal, () => {
			shouldStop = true;
			console.log(`Received ${signal}; stopping after current sync run.`);
		});
	}

	console.log(`Starting periodic stock sync every ${options.intervalMinutes} minute(s).`);
	while (!shouldStop) {
		const startedAt = Date.now();

		try {
			await runSync(options);
		} catch (error) {
			console.error("Periodic stock sync run failed.", error);
		}

		if (shouldStop) {
			break;
		}

		const elapsed = Date.now() - startedAt;
		const waitMilliseconds = Math.max(0, options.intervalMinutes * 60_000 - elapsed);
		if (waitMilliseconds > 0) {
			await sleep(waitMilliseconds);
		}
	}

	console.log("Periodic stock sync stopped.");
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
