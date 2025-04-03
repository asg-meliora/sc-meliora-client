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
    Cookies.remove("token");

    // TODO: Logout Logic
    navigate("/");
  };

  const handleMenuItemClick = (index) => {
    setActiveIndex(index);
    navigate(menuItems[index].route);
  };

  return (
    <div className="h-screen w-55 bg-black-gradient text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] flex flex-col">
      <div className="flex flex-col items-center justify-center transform transition-all  group mb-4:">
        <div className="flex flex-col items-center justify-center p-4 rounded-lg transition-all group-hover:scale-120 group-hover:drop-shadow-[0_0_0.75rem_rgba(240,188,58,0.90)]">
          <img
            src={lion}
            alt="lion logo"
            className="w-50 h-50 drop-shadow-[0_0_15px_rgba(240,188,58,0.50)] mb-[-45px]"
          />
          <span className="text-gray-950 font-semibold font-raleway text-2xl drop-shadow-[0_0_10px_rgba(240,188,58,0.70)]">
            Black Lion
          </span>
        </div>
      </div>
      <nav className="flex flex-col gap-[10px] p-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`flex items-start gap-4 px-4 py-3 rounded-lg transition-all text-base font-lora ${
              activeIndex === index
                ? "bg-gold-gradient font-bold shadow-mid"
                : "hover:cursor-pointer menuButton font-medium hover:scale-110 hover:font-bold transform transition-all"
            }`}
            onClick={() => handleMenuItemClick(index)}
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </button>
        ))}

        <div className="flex justify-center mt-4">
          <div className="flex flex-row">
            <button
              className="flex font-lora items-center gap-3 px-2 py-3 bg-red-gradient shadow-lg logoutButton hover:cursor-pointer rounded-lg m-4 hover:scale-110 hover:font-bold transform transition-all"
              onClick={handleLogout}
            >
              <RiLogoutBoxLine className="text-xl" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SideMenu;
