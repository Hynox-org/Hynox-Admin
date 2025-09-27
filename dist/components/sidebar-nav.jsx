"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
const items = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/quotations", label: "Quotations" },
    { href: "/invoices", label: "Invoices" },
    { href: "/clients", label: "Clients" },
    { href: "/services", label: "Services" },
    { href: "/settings", label: "Settings" }, // new
];
export function SidebarNav() {
    const pathname = usePathname();
    const router = useRouter();
    const handleLogout = () => __awaiter(this, void 0, void 0, function* () {
        yield supabase.auth.signOut();
        router.push("/login");
    });
    return (<aside className="w-full md:w-56 shrink-0 border-r bg-card flex flex-col">
      <div className="p-4">
        <Link href="/dashboard">
          <Image src="/images/hynox_logo-transparent-white.png" alt="Hynox Logo" width={150} height={50}/>
        </Link>
      </div>
      <nav className="p-4 flex-grow">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            return (<li key={item.href}>
                <Link href={item.href} className={cn("block rounded-md px-3 py-2 text-sm transition-colors", active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground")}>
                  {item.label}
                </Link>
              </li>);
        })}
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <Button onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>
    </aside>);
}
