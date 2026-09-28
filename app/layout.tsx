import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "진욱 ♥ 한슬 결혼합니다",
  description: "2027년 6월 5일 토요일 오전 11시, 루클라비 수원 라비에벨 홀",
  openGraph: {
    title: "진욱 ♥ 한슬 결혼합니다",
    description: "2027년 6월 5일 토요일 오전 11시, 루클라비 수원 라비에벨 홀",
    type: "website",
    siteName: "진욱 ♥ 한슬의 모바일 청첩장",
    images: [{
      url: "https://res.cloudinary.com/dhtvrg2js/image/upload/c_fill,f_jpg,g_auto,h_630,q_auto,w_1200/v1775724820/wedding1.jpg",
      width: 1200,
      height: 630,
      alt: "진욱과 한슬의 결혼식 청첩장",
    }],
  },
  twitter: { card: "summary_large_image" },
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
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #E0D8D0; -webkit-font-smoothing: antialiased; }
          .scroll-fade { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
          .scroll-fade.visible { opacity: 1; transform: translateY(0); }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes bounce-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
