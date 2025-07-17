import Header from "@/components/header";
import "../styles/globals.css";
import { Josefin_Sans } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  display: "swap",
});

export const metadata = {
  title: "Tarefas+",
  description: "Organize suas tarefas com leveza",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={josefin.variable}>
      <body className="flex flex-col min-h-screen font-sans">
        <SessionWrapper>
          <Header />
          <main className="flex-1 flex justify-center bg-gray">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
