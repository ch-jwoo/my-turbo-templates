import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Next.js App',
  description: 'Testing internal Turborepo packages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
