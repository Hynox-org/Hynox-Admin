"use client"

import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuid } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveQuote, getCompany, getDefaultTax, getDefaultCurrency, saveDefaultCurrency, saveDefaultTax, listClients, listServices } from "@/lib/storage"
import type { LineItem, Quotation, CompanyInfo, Client, Service } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

function money(n: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n)
  } catch {
    return `${currency} ${n.toFixed(2)}`
  }
}

interface QuotationFormProps {
  initialData?: Quotation;
}

export default function QuotationForm({ initialData }: QuotationFormProps) {
  const router = useRouter()
  const [company, setCompany] = useState<CompanyInfo>({ name: "Hynox", email: "", address: "", phone: "", gstNumber: "", bankName: "", accountNumber: "", ifsc: "", branch: "", upi: "" })
  const [currency, setCurrency] = useState("INR")
  const [taxRate, setTaxRate] = useState(0)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])

  const [quotationId, setQuotationId] = useState<string | undefined>(initialData?.id);
  const [from, setFrom] = useState(initialData?.from || {
    name: company.name || "Hynox",
    email: company.email || "",
    address: company.address || "",
    phone: company.phone || "",
  });
  const [to, setTo] = useState(initialData?.to || { name: "", email: "", address: "", phone: "" });
  const [issueDate, setIssueDate] = useState(initialData?.issueDate || new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState(initialData?.validUntil || "");
  const [number, setNumber] = useState(initialData?.number || `QTN-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`);
  const [discount, setDiscount] = useState(initialData?.discount || 0);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const [items, setItems] = useState<LineItem[]>(initialData?.items || [
    { id: uuid(), description: "", quantity: 1, unitPrice: 0, selectedServiceId: undefined },
  ]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [companyData, defaultCurrency, defaultTax, fetchedClients, fetchedServices] = await Promise.all([
          getCompany(),
          getDefaultCurrency(),
          getDefaultTax(),
          listClients(),
          listServices(),
        ]);
        setCompany(companyData);
        setCurrency(defaultCurrency);
        setTaxRate(defaultTax);
        setClients(fetchedClients);
        setServices(fetchedServices);

        if (!initialData) {
          setFrom({
            name: companyData.name || "Hynox",
            email: companyData.email || "",
            address: companyData.address || "",
            phone: companyData.phone || "",
          });
        }
      } catch (e: any) {
        toast({
          title: "Error loading initial data",
          description: e.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, [initialData]); // Add initialData to dependency array

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0),
    [items],
  )
  const tax = useMemo(() => (subtotal * (Number(taxRate) || 0)) / 100, [subtotal, taxRate])
  const total = useMemo(() => Math.max(0, subtotal + tax - (Number(discount) || 0)), [subtotal, tax, discount])

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }
  function addItem() {
    setItems((prev) => [...prev, { id: uuid(), description: "", quantity: 1, unitPrice: 0 }])
  }
  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  async function onSave(printAfter = false) {
    const q: Quotation = {
      id: quotationId || uuid(), // Use existing ID if available, otherwise generate new
      number,
      issueDate,
      validUntil,
      from,
      to,
      items,
      taxRate: Number(taxRate) || 0,
      discount: Number(discount) || 0,
      notes,
      currency,
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      status: "Draft",
    };
    try {
      const apiPath = quotationId ? `/api/quotations/${quotationId}` : "/api/quotations";
      const method = quotationId ? "PUT" : "POST";

      const response = await fetch(apiPath, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(q),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save quotation");
      }

      const savedQuotation = await response.json();

      toast({
        title: "Quotation saved successfully!",
        description: `Quotation ${savedQuotation.number} has been saved.`,
      });
      if (printAfter) {
        router.push(`/quotations/print/${savedQuotation.id}`);
      } else {
        router.push("/quotations");
      }
    } catch (e: any) {
      toast({
        title: "Error saving quotation",
        description: e.message,
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Loading Quotation Form...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while the form data is being loaded.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Quotation Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="number">Quote Number</Label>
            <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="issue">Issue Date</Label>
            <Input id="issue" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="valid">Valid Until</Label>
            <Input id="valid" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={currency}
              onChange={async (e) => {
                const next = e.target.value.toUpperCase()
                setCurrency(next)
                await saveDefaultCurrency(next)
                toast({
                  title: "Default currency updated",
                  description: `Currency set to ${next}.`,
                })
              }}
            />
          </div>
          <div>
            <Label htmlFor="tax">Tax Rate (%)</Label>
            <Input id="tax" type="number" value={taxRate} onChange={async (e) => {
              const next = Number(e.target.value)
              setTaxRate(next)
              await saveDefaultTax(next)
              toast({
                title: "Default tax rate updated",
                description: `Tax rate set to ${next}%.`,
              })
            }} />
          </div>
          <div>
            <Label htmlFor="discount">Discount ({currency})</Label>
            <Input id="discount" type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">From</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={from.name} readOnly />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={from.email} readOnly />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea value={from.address} readOnly />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={from.phone} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Client</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="client-select">Select Existing Client</Label>
            <Select onValueChange={(clientId) => {
              const selectedClient = clients.find(c => c._id === clientId)
              if (selectedClient) {
                setTo({
                  name: selectedClient.name,
                  email: selectedClient.email || "",
                  address: selectedClient.address || "",
                  phone: selectedClient.phone || "",
                })
              }
            }}>
              <SelectTrigger id="client-select">
                <SelectValue placeholder="Select a client (optional)" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client._id} value={client._id || ""}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={to.name} onChange={(e) => setTo({ ...to, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={to.email} onChange={(e) => setTo({ ...to, email: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea value={to.address} onChange={(e) => setTo({ ...to, address: e.target.value })} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={to.phone} onChange={(e) => setTo({ ...to, phone: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Terms or additional notes" />
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Line Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="grid gap-3 md:grid-cols-12 items-end">
              <div className="md:col-span-6">
                <Label>Description</Label>
                <Select onValueChange={(value) => {
                  if (value === "custom") {
                    updateItem(it.id, { selectedServiceId: undefined, description: "", unitPrice: 0 });
                  } else {
                    const selectedService = services.find(s => s._id === value);
                    if (selectedService) {
                      updateItem(it.id, {
                        selectedServiceId: selectedService._id,
                        description: selectedService.name,
                        unitPrice: selectedService.price,
                      });
                    }
                  }
                }} value={it.selectedServiceId || "custom"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service or type custom">
                      {it.selectedServiceId ? services.find(s => s._id === it.selectedServiceId)?.name : it.description || "Select a service or type custom"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service._id} value={service._id || ""}>
                        {service.name} ({money(service.price, currency)})
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Other / Custom</SelectItem>
                  </SelectContent>
                </Select>
                {/* {it.selectedServiceId === undefined && ( */}
                  <Input
                    value={it.description}
                    onChange={(e) => updateItem(it.id, { description: e.target.value })}
                    placeholder="Service or item description"
                    className="mt-2"
                  />
                {/* )} */}
              </div>
              <div className="md:col-span-2">
                <Label>Qty</Label>
                <Input
                  type="number"
                  value={it.quantity}
                  onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) })}
                />
              </div>
              <div className="md:col-span-3">
                <Label>Unit Price ({currency})</Label>
                <Input
                  type="number"
                  value={it.unitPrice}
                  onChange={(e) => updateItem(it.id, { unitPrice: Number(e.target.value) })}
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button variant="secondary" onClick={() => removeItem(it.id)} className="w-full">
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addItem}>
            Add Item
          </Button>

          <div className="border-t pt-4 grid gap-2 md:grid-cols-3">
            <div className="md:col-span-2" />
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{money(subtotal, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                <span>{money(tax, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span>- {money(Number(discount) || 0, currency)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>{money(total, currency)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => onSave(false)} className="bg-primary text-primary-foreground">
          Save Quotation
        </Button>
        <Button onClick={() => onSave(true)} variant="secondary">
          Save & Print
        </Button>
      </div>
    </div>
  )
}
