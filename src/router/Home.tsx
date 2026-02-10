import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "../components/Sidebar";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Toaster } from "sonner";
import { NotificationProvider } from "../components/Notification/NotificationContext";
import { FiscalYearProvider } from "../hooks/Budget/useFiscalYear";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <NotificationProvider>
      <FiscalYearProvider>
        <Navbar isSidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <AppSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          isMobile={isMobile}
        />
        <Outlet />

        <Toaster position="top-right" expand richColors closeButton />
      </FiscalYearProvider>
    </NotificationProvider>
  );
}
