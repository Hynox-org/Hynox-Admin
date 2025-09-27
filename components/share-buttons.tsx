"use client"

import { Button } from "@/components/ui/button"
import { useCallback } from "react"

type Props = {
  url: string
  subject: string
  message: string
  className?: string
  whatsappTo?: string
}

export default function ShareButtons({ url, subject, message, className, whatsappTo }: Props) {
  const encoded = encodeURIComponent(`${message}\n\n${url}`)

  const buildWaUrl = () => {
    const digits = (whatsappTo || "").replace(/\D/g, "")
    let recipient = ""
    if (digits.length === 10) recipient = `91${digits}`
    else if (digits.startsWith("91")) recipient = digits
    else if (digits.length > 0) recipient = digits
    return recipient ? `https://wa.me/${recipient}?text=${encoded}` : `https://wa.me/?text=${encoded}`
  }

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      alert("Link copied")
    } catch (e) {
      alert("Unable to copy")
    }
  }, [url])

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      <Button
        variant="default"
        onClick={() => window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encoded}`, "_blank")}
      >
        Email
      </Button>
      <Button variant="secondary" onClick={() => window.open(buildWaUrl(), "_blank")}>
        WhatsApp
      </Button>
      <Button variant="secondary" onClick={() => window.open(`sms:?&body=${encoded}`, "_self")}>
        SMS
      </Button>
      <Button variant="outline" onClick={copyLink}>
        Copy link
      </Button>
      <Button variant="outline" onClick={() => window.print()}>
        Download PDF
      </Button>
    </div>
  )
}
