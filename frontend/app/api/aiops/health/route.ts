import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'kloset-aiops',
    timestamp: new Date().toISOString(),
    claude_api_configured: !!process.env.CLAUDE_API_KEY,
    uptime: process.uptime(),
  });
}
