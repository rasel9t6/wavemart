import { getCurrencyRate } from '@/lib/actions';

export default async function CurrencyPage({ amount }: { amount: number }) {
  const currencyRate = await getCurrencyRate();

  return <div>{amount * currencyRate.rates.CNY}</div>;
}
