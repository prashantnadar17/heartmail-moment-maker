export function formatPaise(paise: number, currency = "₹"): string {
  const rupees = paise / 100;
  const hasFraction = paise % 100 !== 0;
  return `${currency}${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}
