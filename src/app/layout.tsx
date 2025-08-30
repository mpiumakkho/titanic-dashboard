import { App as AntdApp, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "Titanic Dashboard",
  description: "Interactive insights from the Titanic dataset",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${prompt.variable} antialiased`}
      >
        <ConfigProvider
          locale={enUS}
          theme={{
            token: {
              colorPrimary: "#1677ff",
              borderRadius: 0,
              colorBgContainer: "var(--background)",
              colorText: "var(--foreground)",
              fontFamily: "var(--font-prompt), Arial, Helvetica, sans-serif",
              fontSize: 16,
            },
            components: {
              Card: {
                borderRadiusLG: 0,
                paddingLG: 16,
                headerBg: "transparent",
              },
              Button: {
                borderRadius: 0,
              },
              Tabs: {
                itemActiveColor: "var(--foreground)",
              },
            },
          }}
        >
          <AntdApp>{children}</AntdApp>
        </ConfigProvider>
      </body>
    </html>
  );
}
