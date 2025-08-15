export function formatRupiah(value: number): string {
    return value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });
}

export function parseRupiah(value: string): number {
    return parseInt(value.replace(/[^\d]/g, "")) || 0;
};