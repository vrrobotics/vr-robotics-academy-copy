const DEMO_PRICE_USD = 1;

const USD_TO_CURRENCY_RATE: Record<string, number> = {
  USD: 1,
  INR: 91.05,
  EUR: 0.93,
  GBP: 0.79,
  AED: 3.67,
  SGD: 1.35,
  CAD: 1.36,
  AUD: 1.53,
};

function detectCurrencyFromLocale(locale: string): string {
  const upper = locale.toUpperCase();
  if (upper.includes('-IN')) return 'INR';
  if (upper.includes('-US')) return 'USD';
  if (upper.includes('-GB')) return 'GBP';
  if (upper.includes('-AE')) return 'AED';
  if (upper.includes('-SG')) return 'SGD';
  if (upper.includes('-CA')) return 'CAD';
  if (upper.includes('-AU')) return 'AUD';
  return 'USD';
}

export function getLocalizedDemoPriceLabel(): string {
  const locale = typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US';
  const currency = detectCurrencyFromLocale(locale);
  const usdLabel = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(DEMO_PRICE_USD);

  if (currency === 'USD') return usdLabel;

  const rate = USD_TO_CURRENCY_RATE[currency] || USD_TO_CURRENCY_RATE.USD;
  const localAmount = DEMO_PRICE_USD * rate;
  const localLabel = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(localAmount);

  return `${localLabel} (~${usdLabel})`;
}
