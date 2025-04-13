import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana", {
    next: { revalidate: 10 },
  });
  const data = await res.json();

  const firstToken = data.pairs[0];
  return NextResponse.json({
    name: firstToken.baseToken.name,
    symbol: firstToken.baseToken.symbol,
    price: parseFloat(firstToken.priceUsd),
    volume: Number(firstToken.volume.h24),
    marketCap: Number(firstToken.liquidity.usd), // approximation
  });
}
