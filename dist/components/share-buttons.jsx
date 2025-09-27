"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
export default function ShareButtons({ url, subject, message, className, whatsappTo }) {
    const encoded = encodeURIComponent(`${message}\n\n${url}`);
    const buildWaUrl = () => {
        const digits = (whatsappTo || "").replace(/\D/g, "");
        let recipient = "";
        if (digits.length === 10)
            recipient = `91${digits}`;
        else if (digits.startsWith("91"))
            recipient = digits;
        else if (digits.length > 0)
            recipient = digits;
        return recipient ? `https://wa.me/${recipient}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    };
    const copyLink = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            yield navigator.clipboard.writeText(url);
            alert("Link copied");
        }
        catch (e) {
            alert("Unable to copy");
        }
    }), [url]);
    return (<div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      <Button variant="default" onClick={() => window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encoded}`, "_blank")}>
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
    </div>);
}
