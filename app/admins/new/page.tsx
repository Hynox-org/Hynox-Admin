"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import AdminForm from "@/components/admin-form"

export default function NewAdminPage() {
  return (
    <main className="flex h-screen">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Create New Admin</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new admin account.
          </p>
        </header>
        <AdminForm />
      </section>
    </main>
  )
}
