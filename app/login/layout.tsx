import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Console Unlock | Vraj Patel Portfolio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
