"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-5xl font-bold text-center mb-6">
        Welcome to <span className="text-primary">Hynox</span>
      </h1>
      <p className="text-xl text-center text-muted-foreground mb-8">
        Your trusted partner for innovative solutions.
      </p>
      <div className="flex gap-4">
        <Button asChild className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="https://hynox.in" target="_blank" rel="noopener noreferrer">
            Learn More
          </Link>
        </Button>
      </div>
    </main>
  )
}
