import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: any): string {
  // Handle null or undefined
  if (!price) return "$0.00";
  
  // Handle already formatted string prices (like "$94.99 USD")
  if (typeof price === 'string') {
    // If it already contains currency, return as is
    if (price.includes('$') || price.includes('USD')) return price;
    // If it's just a number string, format it
    const num = parseFloat(price);
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
  }
  
  // Handle Shopify price objects with amount and currencyCode
  if (typeof price === 'object' && price.amount && price.currencyCode) {
    const amount = parseFloat(price.amount);
    return isNaN(amount) ? "$0.00" : `$${amount.toFixed(2)}`;
  }
  
  // Handle numeric values
  if (typeof price === 'number') {
    return `$${price.toFixed(2)}`;
  }
  
  // Fallback for unexpected formats
  return "$0.00";
}
