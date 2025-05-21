import { AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import SideMenu from "../components/SideMenu";
import styles from "../styles";
import LoadingScreen from "../components/LoadingScreen";
import { useState } from "react";
import { MdMenu } from "react-icons/md";

const Dashboard = () => {
  const [error, setError] = useState(null); // Estado de error
  const [loading, setLoading] = useState(false); // Estado de carga
  const [loadingMessage, setLoadingMessage] = useState(
    "Cargando información..."
  );
  const [showSidemenu, setShowSideMenu] = useState(false);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen message={loadingMessage} />}
      </AnimatePresence>

      <div className={styles.blank_page}>
        <Navbar />
        <div className="inline sm:hidden">
          {showSidemenu && <SideMenu setFullSideBar={setShowSideMenu} />}
        </div>
        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <div className="inline pt-5.5 sm:hidden text-white">
              <div>
                <button
                  onClick={() => setShowSideMenu(true)}
                  className="mt-auto mb-6 p-2 text-3xl rounded-lg hover:cursor-pointer hover:scale-115 transform transition-all"
                >
                  <MdMenu />
                </button>
              </div>
            </div>
            <h2 className={styles.heading_page}>Dashboard</h2>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
