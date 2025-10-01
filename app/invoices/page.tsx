"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useEffect, useState } from "react"
import { Invoice } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

import { toast } from "@/hooks/use-toast"

export default function InvoicesPage() {
  const router = useRouter()
  const [rows, setRows] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSoftDeleteDialogOpen, setIsSoftDeleteDialogOpen] = useState(false)
  const [isHardDeleteDialogOpen, setIsHardDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null); // To track which invoice's status is being updated

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const invoices: Invoice[] = await response.json();
      setRows(invoices);
      toast({
        title: "Invoices loaded successfully!",
        description: `Found ${invoices.length} invoices.`,
      });
    } catch (e: any) {
      setError(e.message);
      toast({
        title: "Error fetching invoices",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (invoiceId: string, newStatus: Invoice['status']) => {
    setUpdatingStatus(invoiceId);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Invoice status updated!",
        description: `Invoice #${rows.find(inv => inv.id === invoiceId)?.number} status changed to ${newStatus}.`,
      });
      fetchInvoices(); // Refresh the list to show updated status
    } catch (e: any) {
      toast({
        title: "Error updating invoice status",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDeleteInvoice = async (id: string, hardDelete: boolean = false) => {
    try {
      const response = await fetch(`/api/invoices/${id}${hardDelete ? '?hardDelete=true' : ''}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: `Invoice ${hardDelete ? 'permanently deleted' : 'soft-deleted'} successfully!`,
        description: `Invoice #${invoiceToDelete?.number || ''} has been ${hardDelete ? 'permanently deleted' : 'soft-deleted'}.`,
      });
      setIsSoftDeleteDialogOpen(false);
      setIsHardDeleteDialogOpen(false);
      fetchInvoices(); // Refresh the list
    } catch (e: any) {
      toast({
        title: "Error deleting invoice",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex h-screen">
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
                <TableHead>Issue Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    No invoices yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.number}</TableCell>
                    <TableCell>{new Date(inv.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{inv.to?.name || "-"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat(undefined, { style: "currency", currency: inv.currency }).format(
                        inv.total,
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={inv.status}
                        onValueChange={(newStatus: Invoice['status']) => handleStatusChange(inv.id, newStatus)}
                        disabled={updatingStatus === inv.id}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Sent">Sent</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/invoices/print/${inv.id}`)}>
                            View / Print
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/invoices/${inv.id}/edit`)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/invoices/print/${inv.id}`)}>
                            Share
                          </DropdownMenuItem>
                          <AlertDialog open={isSoftDeleteDialogOpen && invoiceToDelete?.id === inv.id} onOpenChange={setIsSoftDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setInvoiceToDelete(inv); }}>
                                Soft Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to soft delete this invoice?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will mark invoice #{invoiceToDelete?.number || ''} as deleted, but keep its data for potential recovery.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setInvoiceToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => invoiceToDelete && handleDeleteInvoice(invoiceToDelete.id, false)}>
                                  Soft Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog open={isHardDeleteDialogOpen && invoiceToDelete?.id === inv.id} onOpenChange={setIsHardDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setInvoiceToDelete(inv); }}>
                                Hard Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure you want to hard delete this invoice?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete invoice
                                  #{invoiceToDelete?.number || ''} and remove its data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setInvoiceToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => invoiceToDelete && handleDeleteInvoice(invoiceToDelete.id, true)}>
                                  Hard Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
