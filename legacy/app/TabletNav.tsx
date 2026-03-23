
import { Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import MenuDrawer from "./MenuDrawer";
import type { Database } from "@/schema";
import Image from "next/image";
import SearchInput from "@/components/Products/SearchInput";
import { fetchCategoriesFromDatabase } from "@/utils/fetchers/categories";

const TabletNav = async () => {

  const categories: Database['public']['Tables']['categories']['Row'][] = await fetchCategoriesFromDatabase();

	return (
		<div className="container flex items-center justify-between py-2 border-b lg:hidden border-slate-100">
			<div className="flex items-center space-x-4">
				<MenuDrawer categories={categories} />
				<Link href="/" className="font-bold">
					<Image
						src="/images/new-ds-logo.webp"
						className="object-cover w-16"
						alt="Logo"
						width={400}
						height={400}
					/>
				</Link>
			</div>
			<div className="flex items-center justify-end flex-1 gap-3 ml-4">
				<SearchInput />
				<span>
					<ShoppingCart />
				</span>
			</div>
		</div>
	);
};
export default TabletNav;
