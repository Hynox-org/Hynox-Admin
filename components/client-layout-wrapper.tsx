"use client";

import { usePathname } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";
import React from "react";

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/login";

  return (
    <div className="flex">
      {/* {showSidebar && <SidebarNav />} */}
      <div className="h-screen w-full bg-black relative">
        <main className="flex-1 relative z-10 h-screen">{children}</main>
      </div>
    </div>
  );
}
