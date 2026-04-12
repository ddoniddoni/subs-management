import type { Metadata } from "next";

import { ThemeProvider } from "@/components/shared/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "구독 운영 콘솔",
  description:
    "Next.js와 TypeScript로 구축하는 포트폴리오용 구독 운영 제품입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
