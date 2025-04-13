import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Tailwind className combiner
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Format numbers with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

// ✅ Format large numbers with suffix (K, M, B)
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(num);
}

// ✅ Format time since (e.g., "2h ago", "3 days ago")
export function timeAgo(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) return rtf.format(-count, unit as Intl.RelativeTimeFormatUnit);
  }

  return "just now";
}

// ✅ Truncate long wallet addresses (e.g., 0xabc...def)
export function truncateAddress(addr: string, chars = 4): string {
  if (!addr) return "";
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}
