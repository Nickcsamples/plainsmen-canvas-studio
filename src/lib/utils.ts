import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: any): string {
  // Handle null or undefined
  if (!price) return "$0.00";
  
  // Handle Shopify native price objects first (priceV2 format)
  if (typeof price === 'object' && price.amount && price.currencyCode) {
    const amount = parseFloat(price.amount);
    const symbol = price.currencyCode === 'USD' ? '$' : price.currencyCode;
    return isNaN(amount) ? "$0.00" : `${symbol}${amount.toFixed(2)}`;
  }
  
  // Handle already formatted string prices (like "$94.99 USD") - legacy support
  if (typeof price === 'string') {
    // If it already contains currency, return as is
    if (price.includes('$') || price.includes('USD')) return price;
    // If it's just a number string, format it
    const num = parseFloat(price);
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
  }
  
  // Handle numeric values - legacy support
  if (typeof price === 'number') {
    return `$${price.toFixed(2)}`;
  }
  
  // Fallback for unexpected formats
  return "$0.00";
}

export function getPriceValue(price: any): number {
  if (typeof price === 'string') {
    // Extract numeric value from string like "$94.99 USD" or "$94.99"
    const match = price.replace(/[^0-9.]/g, '');
    return parseFloat(match) || 0;
  }
  
  // Handle price objects from Shopify
  if (typeof price === 'object' && price.amount) {
    return parseFloat(price.amount) || 0;
  }
  
  // Handle numeric values
  if (typeof price === 'number') {
    return price;
  }
  
  return 0;
}
