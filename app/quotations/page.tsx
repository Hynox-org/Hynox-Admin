"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useEffect, useState } from "react"
import { Quotation } from "@/lib/types" // Import Quotation type
import { isValidCurrencyCode } from "@/lib/utils" // Import the utility function
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

export default function QuotationsPage() {
  const router = useRouter()
  const [rows, setRows] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSoftDeleteDialogOpen, setIsSoftDeleteDialogOpen] = useState(false)
  const [isHardDeleteDialogOpen, setIsHardDeleteDialogOpen] = useState(false)
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null); // To track which quotation's status is being updated

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quotations");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const quotations: Quotation[] = await response.json();
      setRows(quotations);
      toast({
        title: "Quotations loaded successfully!",
        description: `Found ${quotations.length} quotations.`,
      });
    } catch (e: any) {
      setError(e.message);
      toast({
        title: "Error fetching quotations",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (quotationId: string, newStatus: Quotation['status']) => {
    setUpdatingStatus(quotationId);
    try {
      const response = await fetch(`/api/quotations/${quotationId}`, {
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
        title: "Quotation status updated!",
        description: `Quotation #${rows.find(q => q.id === quotationId)?.number} status changed to ${newStatus}.`,
      });
      fetchQuotes(); // Refresh the list to show updated status
    } catch (e: any) {
      toast({
        title: "Error updating quotation status",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleDeleteQuotation = async (id: string, hardDelete: boolean = false) => {
    try {
      const response = await fetch(`/api/quotations/${id}${hardDelete ? '?hardDelete=true' : ''}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: `Quotation ${hardDelete ? 'permanently deleted' : 'soft-deleted'} successfully!`,
        description: `Quotation #${quotationToDelete?.number || ''} has been ${hardDelete ? 'permanently deleted' : 'soft-deleted'}.`,
      });
      setIsSoftDeleteDialogOpen(false);
      setIsHardDeleteDialogOpen(false);
      fetchQuotes(); // Refresh the list
    } catch (e: any) {
      toast({
        title: "Error deleting quotation",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <main className="flex h-screen">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Quotations</h1>
          <p>Loading quotations...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex h-screen">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Quotations</h1>
          <p className="text-red-500">Error: {error}</p>
        </section>
      </main>
    );
  }

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
                    No quotations yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>{q.number}</TableCell>
                    <TableCell>{new Date(q.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{q.to?.name || "-"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: isValidCurrencyCode(q.currency) ? q.currency : "USD", // Fallback to USD if currency is invalid
                      }).format(q.total)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={q.status}
                        onValueChange={(newStatus: Quotation['status']) => handleStatusChange(q.id, newStatus)}
                        disabled={updatingStatus === q.id}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Sent">Sent</SelectItem>
                          <SelectItem value="Accepted">Accepted</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
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
                          <DropdownMenuItem onClick={() => router.push(`/quotations/print/${q.id}`)}>
                            View / Print
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/quotations/${q.id}/edit`)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/quotations/print/${q.id}`)}>
                            Share
                          </DropdownMenuItem>
                          <AlertDialog open={isSoftDeleteDialogOpen && quotationToDelete?.id === q.id} onOpenChange={setIsSoftDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setQuotationToDelete(q); }}>
                                Soft Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to soft delete this quotation?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will mark quotation #{quotationToDelete?.number || ''} as deleted, but keep its data for potential recovery.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setQuotationToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => quotationToDelete && handleDeleteQuotation(quotationToDelete.id, false)}>
                                  Soft Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog open={isHardDeleteDialogOpen && quotationToDelete?.id === q.id} onOpenChange={setIsHardDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setQuotationToDelete(q); }}>
                                Hard Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure you want to hard delete this quotation?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete quotation
                                  #{quotationToDelete?.number || ''} and remove its data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setQuotationToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => quotationToDelete && handleDeleteQuotation(quotationToDelete.id, true)}>
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
