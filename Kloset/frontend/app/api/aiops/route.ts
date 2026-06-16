import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'alerts') {
      const alerts = [
        { id: 'a1', level: 'critical', agent: 'KYC-Agent', message: 'Seller verification queue overflow — 12 pending > SLA', time: '8m ago', metric: 'Queue: 12' },
        { id: 'a2', level: 'warning', agent: 'Search-Engine', message: 'P99 latency > 600ms for past 5 min window', time: '22m ago', metric: '619ms p99' },
        { id: 'a3', level: 'warning', agent: 'Escrow-Svc', message: 'Dispute resolution > 48h pending: 3 open cases', time: '35m ago', metric: '3 cases' },
        { id: 'a4', level: 'info', agent: 'Stylist-AI', message: 'New trend vector detected: pastels +20% queries', time: '1h ago', metric: '+20%' },
        { id: 'a5', level: 'critical', agent: 'Booking-Worker', message: 'Pickup overdue flag on 5 bookings', time: '1h ago', metric: '5 overdue' },
      ];
      return NextResponse.json(alerts);
    }

    if (type === 'incidents') {
      const incidents = [
        { id: 'i1', status: 'resolved', agent: 'Stylist-AI', event: 'Latency spike 1200ms', time: '10m ago', duration: '4m 12s', resolution: 'Auto-scaled 2 replicas' },
        { id: 'i2', status: 'investigating', agent: 'Recommend-1', event: 'Recommendation timeout > 3%', time: '42m ago', duration: 'ongoing', resolution: 'Root cause analysis' },
        { id: 'i3', status: 'monitoring', agent: 'Search-2', event: 'Cache miss ratio > 5%', time: '2h ago', duration: '12m', resolution: 'Warming cache' },
        { id: 'i4', status: 'resolved', agent: 'Payment-GW', event: 'Webhook delivery failure', time: '3h ago', duration: '2m 48s', resolution: 'Retry mechanism fixed' },
        { id: 'i5', status: 'monitoring', agent: 'Auth-Svc', event: 'Elevated 401 rate (>2%)', time: '4h ago', duration: '—', resolution: 'Monitoring token refresh' },
      ];
      return NextResponse.json(incidents);
    }

    if (type === 'system-health') {
      return NextResponse.json({
        status: 'healthy',
        cpu: 12.4,
        memory: 248.5,
        dbConnections: 3,
        uptime: 86400,
        healthScore: 94.2,
        errorRate: 0.02,
        timestamp: new Date().toISOString(),
      });
    }

    if (type === 'revenue') {
      return NextResponse.json({
        gbv: 1250000,
        commission: 87500,
        payouts: 1162500,
        growth: 14.6,
        trend: [
          { period: 'Jan', revenue: 125000 },
          { period: 'Feb', revenue: 130000 },
          { period: 'Mar', revenue: 135000 },
          { period: 'Apr', revenue: 142000 },
          { period: 'May', revenue: 148000 },
          { period: 'Jun', revenue: 156000 },
        ],
        topCategories: [
          { name: 'Dresses', revenue: 45000, growth: 12.5 },
          { name: 'Tops', revenue: 38000, growth: 8.2 },
          { name: 'Bottoms', revenue: 32000, growth: 15.3 },
        ],
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Missing type parameter. Use: alerts, incidents, system-health, or revenue' },
      { status: 400 }
    );
  } catch (error) {
    console.error('AIOps API error:', error);
    return NextResponse.json(
      { error: 'AIOps API unavailable' },
      { status: 500 }
    );
  }
}
