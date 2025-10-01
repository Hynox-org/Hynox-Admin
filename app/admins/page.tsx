"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { toast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

interface Admin {
  _id: string
  email: string
  deletedAt?: Date
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSoftDeleteDialogOpen, setIsSoftDeleteDialogOpen] = useState(false)
  const [isHardDeleteDialogOpen, setIsHardDeleteDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null)

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admins")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAdmins(data)
      toast({
        title: "Admins loaded successfully!",
        description: `Found ${data.length} admins.`,
      });
    } catch (e: any) {
      setError(e.message)
      toast({
        title: "Error fetching admins",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleDeleteAdmin = async (id: string, hardDelete: boolean = false) => {
    try {
      const response = await fetch(`/api/admins/${id}${hardDelete ? '?hardDelete=true' : ''}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      toast({
        title: `Admin ${hardDelete ? 'permanently deleted' : 'soft-deleted'} successfully!`,
        description: `${adminToDelete?.email} has been ${hardDelete ? 'permanently deleted' : 'soft-deleted'}.`,
      });
      setIsSoftDeleteDialogOpen(false)
      setIsHardDeleteDialogOpen(false)
      fetchAdmins()
    } catch (e: any) {
      setError(e.message)
      toast({
        title: "Error deleting admin",
        description: e.message,
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <main className="flex h-screen">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Admins</h1>
          <p>Loading admins...</p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex h-screen">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Admins</h1>
          <p className="text-red-500">Error: {error}</p>
        </section>
      </main>
    )
  }

  return (
    <main className="flex h-screen">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admins</h1>
          <Link href="/admins/new">
            <Button variant="secondary">Add Admin</Button>
          </Link>
        </header>

        <div className="mt-6 rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-sm text-muted-foreground"
                  >
                    No Admins yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell className="font-medium">{admin.email}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admins/${admin._id}/edit`}>
                        <Button variant="outline" size="sm" className="mr-2">
                          Edit
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/admins/${admin._id}/edit`}>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                          </Link>
                          <AlertDialog open={isSoftDeleteDialogOpen && adminToDelete?._id === admin._id} onOpenChange={setIsSoftDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setAdminToDelete(admin); }}>
                                Soft Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to soft delete this admin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will mark the admin "{adminToDelete?.email}" as deleted, but keep their data for potential recovery.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setAdminToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => adminToDelete && handleDeleteAdmin(adminToDelete._id, false)}>
                                  Soft Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog open={isHardDeleteDialogOpen && adminToDelete?._id === admin._id} onOpenChange={setIsHardDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setAdminToDelete(admin); }}>
                                Hard Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure you want to hard delete this admin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the admin
                                  account for "{adminToDelete?.email}" and remove their data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setAdminToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => adminToDelete && handleDeleteAdmin(adminToDelete._id, true)}>
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
