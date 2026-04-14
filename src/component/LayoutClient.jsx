"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/component/Sidebar";
import Footer from "@/component/Footer";

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  // Pages where sidebar/footer should not appear
  const hiddenRoutes = ["/login", "/subscription", "/footer", "/premium-details-player"];
  const hide = hiddenRoutes.includes(pathname);

  return (
    <>
      {!hide && <Sidebar />}
      {children}
      {!hide && <Footer />}
    </>
  );
}
