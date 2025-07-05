import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SEO metadata configuration
export const metadata: Metadata = {
  title: "Grid Wars | Online Multiplayer Tic Tac Toe Game",
  description:
    "Play Grid Wars, a fast-paced online multiplayer Tic Tac Toe game. Challenge friends, enjoy real-time gameplay, and experience animated victories!",
  keywords: [
    "tic tac toe online",
    "multiplayer tic tac toe",
    "real-time tic tac toe game",
    "tic tac toe with friends",
    "grid wars game",
    "play tic tac toe",
    "tic tac toe strategy game",
    "2 player tic tac toe",
  ],
  metadataBase: new URL("https://grid-wars.tech"),
  openGraph: {
    title: "Grid Wars | Multiplayer Tic Tac Toe Game",
    description:
      "Challenge your friends in Grid Wars – the ultimate online Tic Tac Toe experience with live moves, confetti wins, and a modern UI!",
    url: "https://grid-wars.tech",
    siteName: "Grid Wars",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Grid Wars - Online Tic Tac Toe",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grid Wars | Multiplayer Tic Tac Toe Game",
    description:
      "Play Grid Wars, a real-time multiplayer Tic Tac Toe game. Join, play, win!",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  authors: [{ name: "Devendra", url: "https://github.com/DevendraCodes93" }],
  creator: "Devendra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
