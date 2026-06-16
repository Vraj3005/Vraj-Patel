import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lab Sandbox | Vraj Patel Experiments',
  description: 'Run Vraj Patel\'s live interactive simulations. Calculates solar irradiance estimates, option volatility smile curves, and backtests Monte Carlo portfolio paths.',
  alternates: {
    canonical: 'https://vrajpatel.dev/lab',
  },
  openGraph: {
    title: 'Lab Sandbox | Vraj Patel Experiments',
    description: 'Run Vraj Patel\'s live interactive simulations. Calculates solar irradiance estimates, option volatility smile curves, and backtests Monte Carlo portfolio paths.',
    url: 'https://vrajpatel.dev/lab',
    type: 'website',
  },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
