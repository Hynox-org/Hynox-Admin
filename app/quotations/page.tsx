"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useEffect, useState } from "react"
import { Quotation } from "@/lib/types" // Import Quotation type

export default function QuotationsPage() {
  const router = useRouter()
  const [rows, setRows] = useState<Quotation[]>([])

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("/api/quotations");
        if (!response.ok) {
          throw new Error("Failed to fetch quotations");
        }
        const quotations: Quotation[] = await response.json();
        setRows(quotations);
      } catch (error) {
        console.error("Error fetching quotations:", error);
        // Optionally, show a toast notification for the error
      }
    };
    fetchQuotes();
  }, []);

  return (
    <main className="flex h-screen">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Quotations</h1>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/quotations/new">Create Quotation</Link>
          </Button>
        </header>

        <div className="mt-6 rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No quotations yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>{q.number}</TableCell>
                    <TableCell>{q.to?.name || "-"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat(undefined, { style: "currency", currency: q.currency }).format(q.total)}
                    </TableCell>
                    <TableCell>{q.status}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => router.push(`/quotations/print/${q.id}`)}>
                        View / Print
                      </Button>
                      <Button size="sm" onClick={() => router.push(`/quotations/${q.id}/edit`)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/quotations/print/${q.id}`)}>
                        Share
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  )
}
