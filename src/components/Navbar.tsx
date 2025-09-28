import { Menu, User } from "lucide-react";
import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { getCurrentUser, clearSession } from "../services/auth";
import { showConfirmOutAlert } from "../utils/alerts"; 

type Props = {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Navbar({ isSidebarOpen, setSidebarOpen }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = React.useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  const navigate = useNavigate();

  const user = getCurrentUser();
  const roleName = user?.role?.name?.toUpperCase();

  const roleLabel =
    roleName === "ADMIN"
      ? "Administrador"
      : roleName === "JUNTA"
      ? "Junta Directiva"
      : "Usuario";

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Manejador actualizado para logout con confirmación
  const handleLogout = async () => {
    const confirmed = await showConfirmOutAlert(
      "Confirmar cierre de sesión",
      "¿Está seguro que desea salir?"
    );
    if (confirmed) {
      clearSession();
      setIsDropdownOpen(false);
      navigate({ to: "/login" });
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-[#DCD6C9] px-4 py-3 shadow-sm">
      <div
        className={`flex items-center justify-between max-w-7xl mx-auto transition-transform duration-300 ${
          isSidebarOpen && isDesktop ? "translate-x-64" : "translate-x-0"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="text-[#2E321B] hover:text-[#708C3E] p-2 rounded-md transition"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 text-[#2E321B] hover:text-[#A3853D] transition"
            onClick={toggleDropdown}
          >
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">{roleLabel}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate({ to: "/account/change-password" });
                  }}
                >
                  Cambiar Contraseña
                </div>

                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
