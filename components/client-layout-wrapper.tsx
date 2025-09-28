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
        {/* Midnight Aurora Glow Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
          radial-gradient(circle at 50% 50%, 
            rgba(58, 123, 255, 0.25) 0%, 
            rgba(100, 149, 237, 0.15) 25%, 
            rgba(123, 104, 238, 0.07) 35%, 
            transparent 50%
          )
        `,
          }}
        ></div>
        <main className="flex-1 relative z-10 h-screen">{children}</main>
      </div>
    </div>
  );
}
