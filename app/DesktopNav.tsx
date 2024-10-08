import SignUp from "@/components/Auth/SignUp";
import { SettingsIcon, ShoppingBag } from "lucide-react";
import Link from "next/link";
import SignIn from "@/components/Auth/SignIn";
import SignOut from "@/components/Auth/SignOut";
import CartSheet from "@/components/Cart/CartSheet";
import Image from "next/image";
import SearchInput from "@/components/Products/SearchInput";
import { getAdmin, getSession } from "@/utils/fetchers/auth";
import { fetchCategoriesFromDatabase } from "@/utils/fetchers/categories";


const DesktopNav = async () => {
	const is_adminData =  getAdmin();
	const sessionData =  getSession();
	const categoriesData =  fetchCategoriesFromDatabase();

  const [is_admin, session, categories] = await Promise.all([is_adminData, sessionData, categoriesData]);


	return (
		<div className="container items-center justify-between hidden py-2 border-b lg:flex border-slate-100">
			<Link href="/" className="font-bold">
				<Image
					src="/images/new-ds-logo.webp"
					alt="Logo"
					width={400}
					height={400}
					className="object-cover w-16"
				/>
			</Link>
			<div className="flex items-center space-x-4">
				<nav className="flex items-center justify-start space-x-3">
					{categories.map((link) => (
						<Link
							className="text-sm font-medium hover:text-slate-300"
							href={`/categories/${link.slug}`}
							key={link.id}
						>
							{link.title}
						</Link>
					))}
				</nav>
			</div>
			<SearchInput />

			<div className="flex items-center">
				<span>
					<CartSheet />
				</span>
				{session ? (
					<>
						<SignOut />
						{is_admin && (
							<Link
								href="/dashboard"
								className="flex items-center px-2 py-1 space-x-1 text-black rounded bg-slate-50"
							>
								<p className="text-black text-md">Dashboard</p>
								<SettingsIcon size={16} />
							</Link>
						)}
					</>
				) : (
					<>
						<SignUp />
						<SignIn />
					</>
				)}
			</div>
		</div>
	);
};
export default DesktopNav;
