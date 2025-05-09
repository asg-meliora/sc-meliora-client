import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import { FaRegFileAlt, FaUsers, FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlineDashboard, MdMenu, MdClose } from "react-icons/md";
import { IoFileTrayFullOutline } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";

const SideBar = ({ setFullSideBar }) => {
  function GetMenuItems() {
    const roleId = Cookies.get("role_id");
    switch (roleId) {
      case "1":
        return [
          {
            name: "Dashboard",
            route: "/dashboard",
            icon: <MdOutlineDashboard />,
          },
          { name: "Expedientes", route: "/files", icon: <FaRegFileAlt /> },
          { name: "Usuarios", route: "/users", icon: <FaUsers /> },
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
      case "2":
        return [
          {
            name: "Facturas",
            route: `/user/invoices/${Cookies.get("user_id")}`,
            icon: <FaFileInvoiceDollar />,
          },
        ];
      default:
        return [];
    }
  }

  const menuItems = GetMenuItems();

  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  // const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const currentIndex = menuItems.findIndex((item) =>
      location.pathname.startsWith(item.route)
    );
    if (currentIndex !== -1) setActiveIndex(currentIndex);
  }, [location.pathname]);

  const handleLogout = () => {
    Cookies.remove("token");
    sessionStorage.removeItem("hasReloaded");
    navigate("/");
  };

  const handleMenuItemClick = (index) => {
    setActiveIndex(index);
    navigate(menuItems[index].route);
    // setMenuOpen(false); // cierra el menú en móviles
  };

  return (
    <>
      {/* Sidebar compacto en desktop */}
      <div className=" md:flex flex-col items-center w-16 h-screen bg-black-gradient z-50 text-white shadow-lg fixed">
        {/* <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="fixed top-4 left-4 z-50 text-white text-3xl bg-black-gradient p-2 rounded-lg"
        >
          {menuOpen ? <MdClose /> : <MdMenu />}
        </button> */}
        {/* <div className="py-4">
          <img src={lion} alt="Logo" className="w-10 h-10" />
        </div> */}
        <nav className="flex flex-col gap-6 mt-4">
          <button
            onClick={() => setFullSideBar(true)}
            className="mt-auto mb-6 p-2 text-3xl rounded-lg hover:cursor-pointer hover:scale-115 transform transition-all"
          >
            <MdMenu />
          </button>
          {/* <div className="h-24"></div> */}
          {menuItems.map((item, index) => (
            <div key={index} className="group relative flex items-center">
              <button
                onClick={() => handleMenuItemClick(index)}
                className={`text-2xl p-3 rounded-lg ${
                  activeIndex === index
                    ? "bg-gold-gradient shadow-lg "
                    : "menuButton  transform "
                } hover:cursor-pointer hover:scale-115 transform transition-all duration-200 ease-in-out`}
              >
                {item.icon}
              </button>
              <span
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 
                 bg-white text-black px-3 py-1 rounded-md shadow-lg 
                 whitespace-nowrap text-base z-[999] 
                 opacity-0 group-hover:opacity-100 
                 transition-opacity duration-500 pointer-events-none"
              >
                {item.name}
              </span>
            </div>
          ))}
          <div className="group relative">
            <button
              onClick={handleLogout}
              className="mt-auto logoutButton mb-6 p-3 rounded-lg bg-red-gradient text-2xl hover:cursor-pointer hover:scale-115 transform transition-all"
            >
              <RiLogoutBoxLine />
            </button>
            <span
              className="absolute left-full top-1/2 -translate-y-1/2 ml-3 
                 bg-white text-black px-3 py-1 rounded-md shadow-lg 
                 whitespace-nowrap text-base z-50 
                 opacity-0 group-hover:opacity-100 
                 transition-opacity duration-500 pointer-events-none"
            >
              Cerrar Sesión
            </span>
          </div>
        </nav>
      </div>

      {/* Overlay de menú lateral para móviles */}
      {/* {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden">
          <div className="w-72 h-full bg-black-gradient text-white p-6 relative">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              <MdClose />
            </button>
            <div className="flex flex-col items-center gap-2 mb-6">
              <img src={lion} alt="Logo" className="w-14 h-14 drop-shadow" />
              <span className="font-bold text-lg drop-shadow-[0_0_10px_rgba(240,188,58,0.70)]">
                Black Lion
              </span>
            </div>
            <nav className="flex flex-col gap-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuItemClick(index)}
                  className={`flex items-center gap-3 p-3 rounded-lg text-base font-lora transition-all ${
                    activeIndex === index
                      ? "bg-gold-gradient font-bold shadow-md"
                      : "hover:scale-105 hover:font-bold"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 mt-4 bg-red-gradient rounded-lg hover:scale-105 transition-all"
              >
                <RiLogoutBoxLine className="text-xl" />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      )} */}
    </>
  );
};

export default SideBar;
