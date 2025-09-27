"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

interface AdminFormProps {
  admin?: { _id: string; email: string } // Optional admin for edit mode
  onSuccess?: () => void
}

export default function AdminForm({ admin, onSuccess }: AdminFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState(admin?.email || "")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (admin) {
      setEmail(admin.email)
      setPassword("") // Always clear password for security
    }
  }, [admin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const method = admin ? "PUT" : "POST"
    const url = admin ? `/api/admins/${admin._id}` : "/api/admins"
    const body: { email: string; password?: string } = { email }
    if (password) {
      body.password = password
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      toast({
        title: admin ? "Admin updated successfully!" : "Admin created successfully!",
        description: admin ? `${email} has been updated.` : `${email} has been created.`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admins")
      }
    } catch (e: any) {
      setError(e.message)
      toast({
        title: admin ? "Error updating admin" : "Error creating admin",
        description: e.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Password {admin && <span className="text-muted-foreground text-xs">(leave blank to keep current)</span>}
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!admin} // Password is only required for new admin creation
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : admin ? "Save Changes" : "Create Admin"}
        </Button>
      </div>
    </form>
  )
}
