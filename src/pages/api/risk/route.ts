// app/api/risk/route.ts
import { NextRequest, NextResponse } from "next/server";

const HELIUS_API_KEY = "07e937d6-44cf-4abf-9fe3-043cd8dd4f51";
const BASE_URL = `https://mainnet.helius.xyz/v0`;

export async function GET(req: NextRequest) {
  const tokenAddress = req.nextUrl.searchParams.get("tokenAddress");

  if (!tokenAddress) {
    return NextResponse.json({ error: "Missing tokenAddress" }, { status: 400 });
  }

  try {
    // Fetch token metadata
    const metaRes = await fetch(
      `${BASE_URL}/tokens/metadata?api-key=${HELIUS_API_KEY}&mint=${tokenAddress}`
    );
    const metadata = await metaRes.json();

    const tokenInfo = metadata?.[0];
    const { creators, isMutable, tokenStandard } = tokenInfo || {};

    // Fetch last 20 transactions for the token address
    const txRes = await fetch(
      `${BASE_URL}/addresses/${tokenAddress}/transactions?api-key=${HELIUS_API_KEY}&limit=20`
    );
    const transactions = await txRes.json();

    let riskScore = 30; // Neutral baseline
    let reasons: string[] = [];

    if (isMutable) {
      riskScore += 20;
      reasons.push("⚠️ Token is mutable (can be changed).");
    }

    if (tokenStandard !== "Fungible") {
      riskScore += 15;
      reasons.push(`⚠️ Unusual token standard: ${tokenStandard}`);
    }

    if (creators?.length && !creators[0].verified) {
      riskScore += 10;
      reasons.push("⚠️ Token creator is unverified.");
    }

    // Analyze suspicious transfers
    const creatorAddress = creators?.[0]?.address;
    const flaggedTxs = transactions.filter((tx: any) =>
      tx.tokenTransfers?.some(
        (t: any) =>
          (t.amount > 1_000_000 || t.toUserAccount === creatorAddress) &&
          t.tokenMint === tokenAddress
      )
    );

    if (flaggedTxs.length > 0) {
      riskScore += 25;
      reasons.push("⚠️ Suspicious large transfers or creator receives tokens.");
    }

    const finalScore = Math.min(100, riskScore);

    return NextResponse.json({
      score: finalScore,
      description: reasons.length ? reasons.join(" ") : "No significant risks detected.",
    });
  } catch (error) {
    console.error("Risk analysis failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
