import {
	createSearchParamsCache,
	createSerializer,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs/server";

export const productSearchParsers = {
	q: parseAsString.withDefault(""),
	category: parseAsString.withDefault("all"),
	sort: parseAsStringLiteral(["featured", "price-asc", "price-desc"] as const).withDefault("featured"),
	stock: parseAsStringLiteral(["all", "in-stock"] as const).withDefault("all"),
	page: parseAsInteger.withDefault(1),
};

export const productSearchCache = createSearchParamsCache(productSearchParsers);
export const serializeProductSearch = createSerializer(productSearchParsers);