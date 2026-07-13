import {
	createSearchParamsCache,
	createSerializer,
	parseAsInteger,
} from "nuqs/server";

export const categoryPageParsers = {
	page: parseAsInteger.withDefault(1),
};

export const categoryPageCache = createSearchParamsCache(categoryPageParsers);
export const serializeCategoryPage = createSerializer(categoryPageParsers);