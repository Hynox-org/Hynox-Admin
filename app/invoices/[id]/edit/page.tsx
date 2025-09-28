import InvoiceForm from "@/components/invoice-form";
import { SidebarNav } from "@/components/sidebar-nav";
import { getInvoiceById } from "@/lib/invoices"; // Assuming a utility to fetch invoice by ID
import { notFound } from "next/navigation";

interface InvoiceEditPageProps {
  params: {
    id: string;
  };
}

export default async function InvoiceEditPage({
  params,
}: InvoiceEditPageProps) {
  const invoice = await getInvoiceById(params.id);

  if (!invoice) {
    notFound();
  }

  return (
    <main className="flex h-screen">
      <SidebarNav />
      <section className="flex-1 p-6">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6">Edit Invoice</h1>
          <InvoiceForm initialData={invoice} />
        </div>
      </section>
    </main>
  );
}
