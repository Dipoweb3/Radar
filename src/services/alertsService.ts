import { TokenAlertData } from '@/components/TokenAlert';

// Fetch alerts from your live Solana token alert API
export const fetchAlerts = async (): Promise<TokenAlertData[]> => {
  try {
    const response = await fetch('https://your-api.com/api/solana/alerts');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform data if needed to match `TokenAlertData[]` structure
    const alerts: TokenAlertData[] = data.map((alert: any) => ({
      id: alert.id,
      symbol: alert.symbol,
      name: alert.name,
      address: alert.address,
      reason: alert.reason,
      timestamp: new Date(alert.timestamp),
      volume: alert.volume,
      volumeChange: alert.volumeChange,
      isRead: alert.isRead ?? false
    }));

    return alerts;
  } catch (error) {
    console.error('Failed to fetch live alerts:', error);
    return []; // fallback to empty array
  }
};
