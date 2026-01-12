export function calculateDiscountPercent(price: number, discountPrice: number) {
    if (discountPrice >= price) return 0;

    return Math.round(((price - discountPrice) / price) * 100);
}