// app/layout.tsx
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'AI Chef',
  description: 'Your fridge-to-recipe assistant!',
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
