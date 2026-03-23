"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
	const router = useRouter();

	return (
		<Button
			variant="ghost"
			onClick={async () => {
				await authClient.signOut({});
				router.push("/");
				router.refresh();
			}}
		>
			Sign out
		</Button>
	);
}