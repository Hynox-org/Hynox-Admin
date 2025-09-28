import { SidebarNav } from "@/components/sidebar-nav";
import QuotationForm from "../../../../components/quotation-form";
import { getQuotationById } from "../../../../lib/quotations"; // Assuming a utility to fetch quotation by ID
import { notFound } from "next/navigation";

interface QuotationEditPageProps {
  params: {
    id: string;
  };
}

export default async function QuotationEditPage({
  params,
}: QuotationEditPageProps) {
  const quotation = await getQuotationById(params.id);

  if (!quotation) {
    notFound();
  }

  return (
    <main className="flex h-screen">
      <SidebarNav />
      <section className="flex-1 p-6">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6">Edit Quotation</h1>
          <QuotationForm initialData={quotation} />
        </div>
      </section>
    </main>
  );
}
