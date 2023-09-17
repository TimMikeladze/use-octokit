import { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import NextAuthProvider from './components/NextAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `use-octokit`,
  description: `An example of how to use use-octokit in a Next.js app`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <body className={inter.className}>{children}</body>
      </NextAuthProvider>
    </html>
  );
}
