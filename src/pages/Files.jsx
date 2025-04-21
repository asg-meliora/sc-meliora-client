import React, { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import FilesTable from "../components/Files/FilesTable";
import FilesCreate from "../components/Files/FilesCreate";
import Cookies from "js-cookie";
import LoadingScreen from "../components/LoadingScreen";
import styles from "../styles";
import { FaPlus } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";

const Files = ({ api }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); //Estado para manejar el status del modal
  const [newFiles, setNewFiles] = useState({ results: [] }); //Estado para manejar los nuevos datos del formulario
  const [error, setError] = useState(null); // Estado de error
  const [loading, setLoading] = useState(true); // Estado de carga
  const [loadingMessage, setLoadingMessage] = useState("Cargando expedientes...");

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
  // vacío, se ejecuta cada vez que renderiza el componente
  // [], se ejecuta la primera vez que renderiza el componente
  // [estado], se ejecuta solo cuando se actualice el estado, sin bucle

  //Pantalla de Carga
  // if (loading) {
  //   return <LoadingScreen />;
  // }

  // Manejo de errores
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl font-semibold">{error}</p>
      </div>
    );
  }

  // Función para manejar la adición de un nuevo archivo
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
      <AnimatePresence>{loading && <LoadingScreen message={loadingMessage} />}</AnimatePresence>
      
      <div className={styles.blank_page}>
        <div className="w-64">
          <SideMenu />
        </div>

        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Expedientes</h2>
            <div className={styles.button_header_container}>
              <button
                onClick={() => setIsModalOpen(true)}
                className={styles.button_header}
              >
                {" "}
                <FaPlus /> Crear Expediente
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
        </div>
      )}
    </>
  );
};

export default Files;
