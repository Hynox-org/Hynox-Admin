export function calcSubtotal(items) {
    return Number(items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0).toFixed(2));
}
export function calcTax(subtotal, percent) {
    return Number((((Number(percent) || 0) / 100) * subtotal).toFixed(2));
}
