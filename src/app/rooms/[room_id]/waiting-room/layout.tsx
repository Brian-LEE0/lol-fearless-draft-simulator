import { ReactNode } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type RoomLayoutProps = {
  children: ReactNode;
};

export default function RoomLayout({ children }: RoomLayoutProps) {
  return (
    <section>{children}</section>
  );
}