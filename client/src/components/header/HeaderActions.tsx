"use client";

import { CircleUser, Search } from "lucide-react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import ModeToggle from "@/components/header/ModeToggle";
import { logout } from "@/actions/auth";

interface HeaderActionsProps {
  fullName: string | null;
}

const HeaderActions = ({ fullName }: HeaderActionsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const data = await logout();
    if (data.status === "success") {
      router.push("/login");
      toast.success(data.message);
    } else toast.error(data.message);
  };

  return (
    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <form className="ml-auto flex-1 sm:flex-initial">
        {fullName && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search post..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        )}
      </form>

      <ModeToggle />

      {fullName ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2 text-lg font-medium">
          <Link
            href="/login"
            className={`transition-colors hover:text-foreground ${pathname === "/login" ? "text-foreground" : "text-muted-foreground"}`}
          >
            Login
          </Link>

          <Link
            href="/signup"
            className={`transition-colors hover:text-foreground ${pathname === "/signup" ? "text-foreground" : "text-muted-foreground"}`}
          >
            Signup
          </Link>
        </div>
      )}
    </div>
  );
};

export default HeaderActions;
