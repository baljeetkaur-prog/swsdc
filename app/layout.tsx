import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import LayoutContent from "./components/LayoutContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://swsdc.vercel.app"),

  title: {
    default: "Singh Welding & Skills Development Centre (SWSDC)",
    template: "%s",
  },

  description:
    "Professional welding training, courses and certification programs at Singh Welding & Skills Development Centre.",

  keywords: [
    "welding training",
    "welding courses",
    "welding certification",
    "welder training",
    "welding institute",
    "welding skills",
    "Singh Welding and Skills Development Centre",
    "SWSDC",
    "welding training Punjab",
    "welding course Phagwara",
  ],

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
          }}
          containerStyle={{
            zIndex: 999999,
          }}
        />

        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
