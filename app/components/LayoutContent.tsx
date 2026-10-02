"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollButtons from "./ScrollButtons";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      {children}

      {!isAdminPage && <Footer />}

      {!isAdminPage && <ScrollButtons />}
    </>
  );
}