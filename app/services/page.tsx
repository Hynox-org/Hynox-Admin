"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Service } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/services")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Service[] = await response.json()
        setServices(data)
        toast({
          title: "Services loaded successfully!",
          description: `Found ${data.length} services.`,
        })
      } catch (e: any) {
        setError(e.message)
        toast({
          title: "Error fetching services",
          description: e.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) {
    return (
      <main className="flex min-h-[80vh]">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Services</h1>
          <p>Loading services...</p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-[80vh]">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Services</h1>
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
          <h1 className="text-2xl font-semibold">Services</h1>
          <Button variant="secondary">Add Service</Button>
        </header>

        <div className="mt-6 rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-sm text-muted-foreground"
                  >
                    No Clients yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>${service.price.toFixed(2)}</TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  )
}
