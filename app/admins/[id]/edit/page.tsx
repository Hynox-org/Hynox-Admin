"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import AdminForm from "@/components/admin-form"
import { toast } from "@/hooks/use-toast"

interface Admin {
  _id: string
  email: string
}

export default function EditAdminPage() {
  const { id } = useParams()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      const fetchAdmin = async () => {
        try {
          const response = await fetch(`/api/admins/${id}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          setAdmin(data)
          toast({
            title: "Admin loaded successfully!",
            description: `Admin ${data.email} loaded for editing.`,
          });
        } catch (e: any) {
          setError(e.message)
          toast({
            title: "Error fetching admin",
            description: e.message,
            variant: "destructive",
          });
        } finally {
          setLoading(false)
        }
      }
      fetchAdmin()
    }
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-[80vh]">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Edit Admin</h1>
          <p>Loading admin details...</p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-[80vh]">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Edit Admin</h1>
          <p className="text-red-500">Error: {error}</p>
        </section>
      </main>
    )
  }

  if (!admin) {
    return (
      <main className="flex min-h-[80vh]">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Edit Admin</h1>
          <p>Admin not found.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-[80vh]">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Edit Admin</h1>
          <p className="text-sm text-muted-foreground">
            Update the details for {admin.email}.
          </p>
        </header>
        <AdminForm admin={admin} />
      </section>
    </main>
  )
}
