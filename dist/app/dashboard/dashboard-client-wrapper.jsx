"use client";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
export default function DashboardClientWrapper({ status, message }) {
    useEffect(() => {
        if (status === "success") {
            toast({
                title: "Dashboard data loaded",
                description: message,
            });
        }
        else {
            toast({
                title: "Error loading dashboard data",
                description: message,
                variant: "destructive",
            });
        }
    }, [status, message]);
    return null; // This component doesn't render anything visible
}
