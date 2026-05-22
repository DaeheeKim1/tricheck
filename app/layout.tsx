import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import DemoNav from "@/components/DemoNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tricheck - 5분 레퍼런스 체크 서비스",
  description: "후보자 정보를 입력하면 추천인에게 자동으로 설문이 발송되고 AI가 레퍼런스 리포트를 생성합니다. 이제 5분이면 끝납니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.className} min-h-full bg-[#F9FAFB] text-gray-900 antialiased flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <DemoNav />
      </body>
    </html>
  );
}
