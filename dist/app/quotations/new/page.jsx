import { SidebarNav } from "@/components/sidebar-nav";
import QuotationForm from "@/components/quotation-form";
export default function NewQuotationPage() {
    return (<main className="flex h-screen">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Create Quotation</h1>
          <p className="text-sm text-muted-foreground">Use a neat, white template and your logo at the top.</p>
        </header>
        <QuotationForm />
      </section>
    </main>);
}
