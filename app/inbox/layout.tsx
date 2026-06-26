import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inbox | Vraj Patel Portfolio Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
