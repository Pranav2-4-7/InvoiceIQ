import { NextRequest, NextResponse } from 'next/server';

let cachedRates: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_DURATION = 3600000; // 1 hour

const fallbackRates: Record<string, number> = {
  INR: 83.72, EUR: 0.92, GBP: 0.79, JPY: 149.50, AED: 3.67,
  SGD: 1.34, AUD: 1.53, CAD: 1.37, CHF: 0.88, CNY: 7.24,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get('base') || 'USD';
  const target = searchParams.get('target') || 'INR';

  try {
    const apiKey = process.env.OPEN_EXCHANGE_RATES_API_KEY;

    if (apiKey && (!cachedRates || Date.now() - cachedRates.timestamp > CACHE_DURATION)) {
      const res = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}`);
      if (res.ok) {
        const data = await res.json();
        cachedRates = { rates: data.rates, timestamp: Date.now() };
      }
    }

    const rates = cachedRates?.rates || fallbackRates;
    const baseRate = rates[base] || 1;
    const targetRate = rates[target] || rates.INR;
    const conversionRate = targetRate / baseRate;

    return NextResponse.json({
      base, target, rate: conversionRate,
      timestamp: cachedRates?.timestamp || Date.now(),
      cached: !!cachedRates,
    });
  } catch (error) {
    console.error('FX rate error:', error);
    return NextResponse.json({
      base, target, rate: fallbackRates[target] || 83.72,
      timestamp: Date.now(), cached: false, fallback: true,
    });
  }
}
