import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import {
  FaRegFileAlt,
  FaUsers,
  FaCog,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { IoFileTrayFullOutline } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";

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
  { name: "Users", route: "/users", icon: <FaUsers />, active: false },
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
    const currentIndex = menuItems.findIndex((item) => item.route === location.pathname);
    if (currentIndex !== -1) setActiveIndex(currentIndex);
  }, [location.pathname]);

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    Cookies.remove("token");

    // TODO: Logout Logic
    navigate("/");
  };

  const handleMenuItemClick = (index) => {
    setActiveIndex(index);
    navigate(menuItems[index].route);
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">LOGO</div>
      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeIndex === index ? "bg-yellow-600" : "hover:bg-yellow-900"
              }`}
            onClick={() => handleMenuItemClick(index)}
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </button>
        ))}

        <button
          className="flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg m-4"
          onClick={handleLogout}
        >
          <RiLogoutBoxLine className="text-xl" />
          Cerrar sesión
        </button>
      </nav>
    </div>
  );
};

export default SideMenu;
