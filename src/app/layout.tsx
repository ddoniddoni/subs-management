import type { Metadata } from "next";
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
    <html lang="ko">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
