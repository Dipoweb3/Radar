// app/api/solana/alerts/route.ts

import { NextResponse } from 'next/server';

const PUMPFUN_API = 'https://pump.fun/api/token';
const DEX_API = 'https://api.dexscreener.com/latest/dex/pairs/solana';
const HELIUS_API = `https://api.helius.xyz/v0/addresses`; // fill in when using clusters
const HELIUS_KEY = process.env.HELIUS_KEY;

export async function GET() {
  try {
    // 1. Get top trending Pump.fun tokens
    const pumpRes = await fetch(PUMPFUN_API);
    const pumpData = await pumpRes.json();

    const topTokens = Object.values(pumpData)
      .filter((t: any) => t.volume > 10000 && t.watchCount > 20) // Volume spike + interest
      .slice(0, 10);

    // 2. Map each to enriched alert
    const alerts = await Promise.all(
      topTokens.map(async (token: any) => {
        const tokenAddress = token.tokenId;

        // Fetch volume info from Dexscreener
        const dexRes = await fetch(`${DEX_API}/${tokenAddress}`);
        const dexData = await dexRes.json();
        const pair = dexData?.pairs?.[0];

        // Optional: Wallet clustering using Helius (mocked here)
        const clusterTag = token.creator?.includes('1111') ? 'Bot Suspected' : 'Likely legit';

        return {
          id: token.tokenId,
          symbol: token.ticker,
          name: token.name,
          address: token.tokenId,
          reason: pair?.priceChange?.h1 > 100 ? 'Price pump' : 'Trending on Pump.fun',
          timestamp: new Date().toISOString(),
          volume: token.volume,
          volumeChange: pair?.priceChange?.h1 ?? 0,
          isRead: false,
          cluster: clusterTag,
        };
      })
    );

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('[ALERT API] Error fetching live data:', error);
    return NextResponse.json({ error: 'Failed to fetch live alerts' }, { status: 500 });
  }
}
