import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K-Learning Center | 학습 진단 검사 플랫폼",
  description: "학생과 학부모를 위한 학습 진단 검사 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
