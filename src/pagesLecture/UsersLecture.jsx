import { useState, useEffect, useCallback } from "react";
import UsersTable from "../components/Users/UsersTable";
import Cookies from "js-cookie";
import SuccessToast from "../components/SuccessToast";
import LoadingScreen from "../components/LoadingScreen";
import { AnimatePresence } from "framer-motion";

import styles from "../styles";
import Navbar from "../components/Navbar";
import { MdMenu } from "react-icons/md";
import SideMenu from "../components/SideMenu";
import ErrorToast from "../components/ErrorToast";

const UsersLecture = ({ api }) => {
  const [loading, setLoading] = useState(true); // State for activating/deactivating send form button
  const [loadingMessage, setLoadingMessage] = useState("Cargando usuarios...");
  const [dataBoard, setUsersBoard] = useState({ results: [] });
  const [success, setSuccess] = useState(false);
  // const [successMessage, setSuccessMessage] = useState("");
  const [showSidemenu, setShowSideMenu] = useState(false);
  const [error, setError] = useState(null);



  /**
   * Function that fetches the list of users from the server and updates the user board state
   * @async
   * @function fetchUsers
   * @returns {Promise<void>} Promise that resolves when users are fetched correctly & its state changes
   * @throws {Error} Throws error if the request fails
   */
  const fetchUsers = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado. Por favor, inicia sesión.");
      setError("Token no encontrado. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await fetch(`${api}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsersBoard(data);
    } catch (error) {
      setError(error.message);
      console.log("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen message={loadingMessage} />}
      </AnimatePresence>
      <div className={styles.blank_page}>
        <Navbar />
        {showSidemenu && <SideMenu setFullSideBar={setShowSideMenu} />}
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
            <h2 className={styles.heading_page}>Usuarios</h2>
            <div >
            </div>
          </div>
          <UsersTable
            api={api}
            dataBoard={dataBoard}
          />
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {success && (
            <SuccessToast
              message={successMessage}
              onClose={() => setSuccess(false)}
              variant="x"
            />
          )}
          {error && (
            <ErrorToast
              message={error}
              onClose={() => setError(null)}
              variant="x"
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default UsersLecture