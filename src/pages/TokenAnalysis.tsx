"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface TokenData {
  name: string;
  symbol: string;
  price: number;
  volume: number;
  marketCap: number;
}

interface RiskScore {
  score: number;
  description: string;
}

interface PlatformData {
  pumpFunVolume: number;
  dexScreenerTrend: string;
}

interface WalletCluster {
  clusterId: string;
  profit: number;
  isSmart: boolean;
  relatedTokens: string[];
}

export default function TokenAnalysis() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [walletClusters, setWalletClusters] = useState<WalletCluster[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTokenData = async () => {
    try {
      const res = await fetch("/api/token");
      const data = await res.json();
      setTokenData(data);
    } catch (err) {
      console.error("Error fetching token data:", err);
    }
  };

  const fetchRiskScore = async () => {
    try {
      const res = await fetch("/api/risk");
      const data = await res.json();
      setRiskScore(data);
    } catch (err) {
      console.error("Error fetching risk score:", err);
    }
  };

  const fetchPlatformData = async () => {
    try {
      const res = await fetch("/api/platform");
      const data = await res.json();
      setPlatformData(data);
    } catch (err) {
      console.error("Error fetching platform data:", err);
    }
  };

  const fetchWalletClusters = async () => {
    try {
      const res = await fetch("/api/wallets");
      const data = await res.json();
      setWalletClusters(data);
    } catch (err) {
      console.error("Error fetching wallet clusters:", err);
    }
  };

  const fetchData = useCallback(() => {
    setLoading(true);
    fetchTokenData();
    fetchRiskScore();
    fetchPlatformData();
    fetchWalletClusters();
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="animate-spin w-4 h-4" />
          Refreshing token data...
        </div>
      )}

      {tokenData && (
        <Card>
          <CardContent className="p-4 space-y-1">
            <div className="text-xl font-semibold">
              {tokenData.name} ({tokenData.symbol})
            </div>
            <div className="text-sm text-muted-foreground">
              Price: ${tokenData.price.toFixed(4)} | Volume: ${tokenData.volume.toLocaleString()} | Market Cap: ${tokenData.marketCap.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {riskScore && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Risk Score</div>
              <Badge variant={riskScore.score > 70 ? "destructive" : "default"}>
                {riskScore.score}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {riskScore.description}
            </div>
          </CardContent>
        </Card>
      )}

      {platformData && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium">Pump.fun Volume</div>
            <div className="text-sm text-muted-foreground mb-2">
              ${platformData.pumpFunVolume.toLocaleString()}
            </div>
            <div className="text-sm font-medium">Dexscreener Trend</div>
            <div className="text-sm text-muted-foreground">
              {platformData.dexScreenerTrend}
            </div>
          </CardContent>
        </Card>
      )}

      {walletClusters.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-2">Wallet Clusters</div>
            <div className="space-y-2">
              {walletClusters.map((cluster, i) => (
                <div
                  key={i}
                  className="flex justify-between items-start border rounded-lg p-2"
                >
                  <div>
                    <div className="text-sm font-medium">
                      Cluster ID: {cluster.clusterId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Profit: ${cluster.profit.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Related Tokens: {cluster.relatedTokens.join(", ")}
                    </div>
                  </div>
                  {cluster.isSmart && <Badge variant="outline">Smart Wallet</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
