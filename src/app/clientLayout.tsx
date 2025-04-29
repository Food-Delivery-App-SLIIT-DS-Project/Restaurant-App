"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/";

  return (
    <>
      {showNavbar && (
        <header>
          <NavBar />
        </header>
      )}
      <main>{children}</main>
    </>
  );
}
