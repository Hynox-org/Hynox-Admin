"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { listInvoices } from "@/lib/storage"
import { useEffect, useState } from "react"
import { Invoice } from "@/lib/types"

export default function InvoicesPage() {
  const router = useRouter()
  const [rows, setRows] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoices = await listInvoices();
      setRows(invoices);
    };
    fetchInvoices();
  }, []);

  return (
    <main className="flex min-h-[80vh]">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/invoices/new">Create Invoice</Link>
          </Button>
        </header>

        <div className="mt-6 rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
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
                    No invoices yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.number}</TableCell>
                    <TableCell>{inv.to?.name || "-"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat(undefined, { style: "currency", currency: inv.currency }).format(
                        inv.total,
                      )}
                    </TableCell>
                    <TableCell>{inv.status}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => router.push(`/invoices/print/${inv.id}`)}>
                        View / Print
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/invoices/print/${inv.id}`)}>
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
