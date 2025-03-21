import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaRegFileAlt,
  FaUsers,
  FaCog,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { IoFileTrayFullOutline } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";

import lion from "../assets/lion.webp";

const menuItems = [
  {
    name: "Dashboard",
    route: "/dashboard",
    icon: <MdOutlineDashboard />,
  },
  {
    name: "Expedientes",
    route: "/files",
    icon: <FaRegFileAlt />,
  },
  { name: "Usuarios", route: "/users", icon: <FaUsers />, active: false },
  {
    name: "Facturas",
    route: "/invoices",
    icon: <FaFileInvoiceDollar />,
  },
  {
    name: "Histórico",
    route: "/historical",
    icon: <IoFileTrayFullOutline />,
  },
];

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const currentIndex = menuItems.findIndex(
      (item) => item.route === location.pathname
    );
    if (currentIndex !== -1) setActiveIndex(currentIndex);
  }, [location.pathname]);

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    // TODO: Logout Logic
    navigate("/");
  };

  const handleMenuItemClick = (index) => {
    setActiveIndex(index);
    navigate(menuItems[index].route);
  };

  return (
    <div className="h-screen w-64 bg-black-gradient text-white flex flex-col">
      <div className="flex items-center justify-center">
        <img
          src={lion}
          alt="lion logo"
          className="w-50 h-50 drop-shadow-[0_0_15px_rgba(255,180,0,0.8)]"
        />
      </div>
      <nav className="flex flex-col gap-[10px] p-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`flex items-start gap-4 px-4 py-3 rounded-lg transition-all text-base font-lora ${
              activeIndex === index
                ? "bg-gold-gradient shadow-mid"
                : "hover:cursor-pointer menuButton"
            }`}
            onClick={() => handleMenuItemClick(index)}
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </button>
        ))}

        <button
          className="flex font-lora items-center gap-3 px-2 py-3 bg-red-gradient logoutButton hover:cursor-pointer rounded-lg m-4 "
          onClick={handleLogout}
        >
          <RiLogoutBoxLine className="text-xl" />
          Cerrar Sesión
        </button>
      </nav>
    </div>
  );
};

export default SideMenu;
