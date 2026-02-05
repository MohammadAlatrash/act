import DashboardLayout from '../components/Layout/DashboardLayout';
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Athar | أثر',
  description: 'The Sovereign Life Operating System',
};

import { FocusProvider } from '../context/FocusContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FocusProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </FocusProvider>
      </body>
    </html>
  );
}
