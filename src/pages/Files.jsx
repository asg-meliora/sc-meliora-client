import React, { useEffect, useState } from "react";
import FilesTable from "../components/Files/FilesTable";
import FilesCreate from "../components/Files/FilesCreate";
import Cookies from "js-cookie";
import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles";
import { FaPlus } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { MdMenu } from "react-icons/md";
import SideMenu from "../components/SideMenu";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";

const Files = ({ api }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); //Estado para manejar el status del modal
  const [newFiles, setNewFiles] = useState({ results: [] }); //Estado para manejar los nuevos datos del formulario
  const [error, setError] = useState(null); // Estado de error
  const [loading, setLoading] = useState(true); // Estado de carga
  const [loadingMessage, setLoadingMessage] = useState(
    "Cargando expedientes..."
  );
  const [showSidemenu, setShowSideMenu] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await fetch(`${api}/clients/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": Cookies.get("token"),
          },
        });

        const data = await response.json();
        setNewFiles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Carga finalizada
      }
    };

    getClients();
  }, [api]);

  // Manejo de errores
  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <p className="text-red-500 text-xl font-semibold">{error}</p>
  //     </div>
  //   );
  // }

  // Función para manejar la adición de un nuevo expediente
  const handleNewFile = (newFile) => {
    const updatedResults = Array.isArray(newFile) ? newFile.flat() : [newFile]; // Aplanar el array de resultados, si newFile es un array dentro de results
    setNewFiles((prevFiles) => ({
      ...prevFiles,
      results: [...prevFiles.results, ...updatedResults],
    })); // Acceder a prevFiles.results
  };

  //console.log('Debug Padre',newFiles);
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
            <h2 className={styles.heading_page}>Expedientes</h2>
            <div className={styles.button_header_container}>
              <button
                onClick={() => setIsModalOpen(true)}
                className={styles.button_header}
              >
                <FaPlus />{" "}
                <span className="hidden sm:inline-block">Crear Expediente</span>
              </button>
            </div>
          </div>
          <FilesTable api={api} newFiles={newFiles} />
        </div>
      </div>
      {isModalOpen && (
        <div className={`${styles.form_container}`}>
          <div className={styles.form_modal_bg}></div>
          <FilesCreate
            api={api}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddFile={handleNewFile}
            setLoading={setLoading}
            setLoadingMessage={setLoadingMessage}
            />
            setSuccess={setSuccess}
            setSuccessMessage={setSuccessMessage}
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {error && (
            <ErrorToast
              message={error}
              onClose={() => setError(null)}
              variant="x"
            />
          )}
        </AnimatePresence>
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
        </AnimatePresence>
      </div>
    </>
  );
};

export default Files;
