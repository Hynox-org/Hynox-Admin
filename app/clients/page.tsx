"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false)
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false)
  const [isSoftDeleteDialogOpen, setIsSoftDeleteDialogOpen] = useState(false)
  const [isHardDeleteDialogOpen, setIsHardDeleteDialogOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState<Client | null>(null)
  const [newClient, setNewClient] = useState<Omit<Client, "_id">>({ name: "", email: "", address: "", phone: "" })

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Client[] = await response.json();
      setClients(data);
      toast({
        title: "Clients loaded successfully!",
        description: `Found ${data.length} clients.`,
      });
    } catch (e: any) {
      setError(e.message);
      toast({
        title: "Error fetching clients",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDeleteClient = async (id: string, hardDelete: boolean = false) => {
    try {
      const response = await fetch(`/api/clients/${id}${hardDelete ? '?hardDelete=true' : ''}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: `Client ${hardDelete ? 'permanently deleted' : 'soft-deleted'} successfully!`,
        description: `${currentClient?.name || ''} has been ${hardDelete ? 'permanently deleted' : 'soft-deleted'}.`,
      });
      setIsSoftDeleteDialogOpen(false);
      setIsHardDeleteDialogOpen(false);
      fetchClients(); // Refresh the list
    } catch (e: any) {
      toast({
        title: "Error deleting client",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <main className="flex h-screen">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p>Loading clients...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex h-screen">
        <SidebarNav />
        <section className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-red-500">Error: {error}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex h-screen">
      <SidebarNav />
      <section className="flex-1 p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Clients</h1>
          <Button variant="secondary" onClick={() => {
            setNewClient({ name: "", email: "", address: "", phone: "" });
            setIsAddClientDialogOpen(true);
          }}>Add Client</Button>
        </header>

        <div className="mt-6 rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-sm text-muted-foreground"
                  >
                    No Clients yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => {
                            setCurrentClient(client);
                            setNewClient({ name: client.name, email: client.email, address: client.address, phone: client.phone });
                            setIsEditClientDialogOpen(true);
                          }}>
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog open={isSoftDeleteDialogOpen && currentClient?._id === client._id} onOpenChange={setIsSoftDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setCurrentClient(client); }}>
                                Soft Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to soft delete this client?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will mark the client "{currentClient?.name || ''}" as deleted, but keep their data for potential recovery.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setCurrentClient(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => { if (currentClient?._id) handleDeleteClient(currentClient._id, false); }}>
                                  Soft Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog open={isHardDeleteDialogOpen && currentClient?._id === client._id} onOpenChange={setIsHardDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setCurrentClient(client); }}>
                                Hard Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure you want to hard delete this client?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the client
                                  "{currentClient?.name || ''}" and remove their data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setCurrentClient(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => { if (currentClient?._id) handleDeleteClient(currentClient._id, true); }}>
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

        {/* Add Client Dialog */}
        <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddClientDialogOpen(false)}>Cancel</Button>
              <Button onClick={async () => {
                try {
                  const response = await fetch("/api/clients", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newClient),
                  });

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  toast({
                    title: "Client added successfully!",
                    description: `${newClient.name} has been added.`,
                  });
                  setIsAddClientDialogOpen(false);
                  fetchClients(); // Refresh the list
                } catch (e: any) {
                  toast({
                    title: "Error adding client",
                    description: e.message,
                    variant: "destructive",
                  });
                }
              }}>Add Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="edit-phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="edit-address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditClientDialogOpen(false)}>Cancel</Button>
              <Button onClick={async () => {
                if (!currentClient?._id) {
                  toast({
                    title: "Error updating client",
                    description: "Client ID is missing.",
                    variant: "destructive",
                  });
                  return;
                }
                try {
                  const response = await fetch(`/api/clients/${currentClient._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newClient),
                  });

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  toast({
                    title: "Client updated successfully!",
                    description: `${newClient.name} has been updated.`,
                  });
                  setIsEditClientDialogOpen(false);
                  fetchClients(); // Refresh the list
                } catch (e: any) {
                  toast({
                    title: "Error updating client",
                    description: e.message,
                    variant: "destructive",
                  });
                }
              }}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Client Alert Dialogs are now handled within the DropdownMenu */}
      </section>
    </main>
  );
}
