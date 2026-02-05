import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Athar | أثر',
  description: 'The Sovereign Life Operating System',
};

import { FocusProvider } from '../context/FocusContext';
import { LanguageProvider } from '../context/LanguageContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <FocusProvider>
              {children}
            </FocusProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
