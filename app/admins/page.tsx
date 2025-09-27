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

interface Admin {
  _id: string
  email: string
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
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

  const handleDeleteAdmin = async (id: string) => {
    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      toast({
        title: "Admin deleted successfully!",
        description: `${adminToDelete?.email} has been deleted.`,
      });
      setIsDeleteDialogOpen(false)
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
      <main className="flex min-h-[80vh]">
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
      <main className="flex min-h-[80vh]">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Admins</h1>
          <p className="text-red-500">Error: {error}</p>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-[80vh]">
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
                      <AlertDialog open={isDeleteDialogOpen && adminToDelete?._id === admin._id} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" onClick={() => setAdminToDelete(admin)}>
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the admin
                              account for "{adminToDelete?.email}" and remove their data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setAdminToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => adminToDelete && handleDeleteAdmin(adminToDelete._id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
