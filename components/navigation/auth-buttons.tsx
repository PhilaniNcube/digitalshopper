import Link from "next/link";
import { ChevronDown, LayoutDashboard } from "lucide-react";
import { CartSheet } from "@/components/cart/cart-sheet";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/lib/session";

function getUserInitials(name?: string | null, email?: string | null) {
  const value = name?.trim() || email?.trim() || "User";
  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const AuthButtons = async () => {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" className="rounded-full px-4 bg-primary text-white! hover:bg-primary-strong hover:text-slate-700!">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button
          asChild
          className="rounded-full bg-primary-strong px-4 text-sm font-semibold text-black hover:bg-cyan-300 hover:text-white!"
        >
          <Link href="/sign-up">Sign up</Link>
        </Button>
        <CartSheet />
      </div>
    );
  }

  const userName = session.user.name?.trim() || "My account";
  const userEmail = session.user.email?.trim() || "Signed in";
  const userInitials = getUserInitials(session.user.name, session.user.email);

  return (
    <div className="flex items-center gap-2">
      <CartSheet />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto rounded-full border border-white/10 bg-white/4 px-2 py-1.5 text-slate-100 hover:border-white/20 hover:bg-white/8"
          >
            <Avatar size="sm">
              <AvatarFallback className="bg-primary-strong/20 text-xs font-semibold text-primary-strong">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 text-left md:block">
              <p className="truncate text-sm font-medium text-white">{userName}</p>
              <p className="truncate text-xs text-slate-400">{userEmail}</p>
            </div>
            <ChevronDown className="size-4 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 rounded-2xl border border-white/10 bg-slate-950/95 p-2 text-slate-100 backdrop-blur-xl">
          <DropdownMenuLabel className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-white">{userName}</p>
            <p className="truncate text-xs text-slate-400">{userEmail}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-slate-100 focus:bg-white/10 focus:text-white">
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              <span>My account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <div className="px-1 py-1">
            <SignOutButton />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthButtons;