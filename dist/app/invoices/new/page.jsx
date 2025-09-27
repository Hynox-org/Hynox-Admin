import { SidebarNav } from "@/components/sidebar-nav";
import InvoiceForm from "@/components/invoice-form";
export default function NewInvoicePage() {
    return (<main className="flex min-h-[80vh]">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Create Invoice</h1>
          <p className="text-sm text-muted-foreground">
            Fill details below to generate a clean, white invoice with your logo.
          </p>
        </header>
        <InvoiceForm />
      </section>
    </main>);
}
