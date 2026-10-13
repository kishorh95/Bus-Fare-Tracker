import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'BusFare Tracker',
  description: 'Track observed Indian bus fares over time.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
