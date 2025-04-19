import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideMenu from "../../components/SideMenu";
import Cookies from "js-cookie";
import { SiGoogledocs } from "react-icons/si";
import FilesTableDetail from "./FileTableDetail.jsx";
import ErrorToast from "../ErrorToast.jsx";
import { AnimatePresence } from "framer-motion";

import LoadingScreen from "../LoadingScreen.jsx";

function FileDetail({ api }) {
  const { id } = useParams();
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [newFiles, setNewFiles] = useState({ results: [] }); //Estado para manejar los nuevos datos del formulario
  const [error, setError] = useState(null); // Estado de error
  const [loading, setLoading] = useState(true); // Estado de carga

  //Peticion para ver los datos del expediente
  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await fetch(`${api}/clients/byid/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": Cookies.get("token"),
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el Documento");
        }
        const data = await response.json();
        setNewFiles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Carga finalizada
      }
    };

    getClients();
  }, [api, id]);

  useEffect(() => {
    const getFileDetail = async () => {
      try {
        const response = await fetch(`${api}/docs/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": Cookies.get("token"),
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el Documento");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Carga finalizada
      }
    };

    getFileDetail();

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [api, id, fileUrl]);

  // Pantalla de carga
  if (loading) {
    return <LoadingScreen />;
  }

  // Manejo de errores
  // if (error) {
  //     return (
  //         <div className="flex items-center justify-center h-screen">
  //             <p className="text-red-500 text-xl font-semibold">{error}</p>
  //         </div>
  //     );
  // }

  const handlePreviewClick = () => {
    setIsPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setIsPreviewVisible(false);
  };

  console.log(newFiles); //Quitarlo

  return (
    <>
      <div className="flex flex-wrap bg-gray-100">
        <SideMenu className="w-full md:w-1/4" />
        <div className="flex-1 w-full md:w-3/4 m-3 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Expediente No. {id}
          </h1>

          {/*Detalles del expediente*/}
          <div className="w-full">
            <FilesTableDetail data={newFiles} />
          </div>

          {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
          {!isPreviewVisible && (
            <div
              onClick={handlePreviewClick}
              className="cursor-pointer flex items-center justify-center w-62 h-52 bg-gray-200 rounded-lg"
            >
              <SiGoogledocs className="w-26 h-26" />
              CSF
            </div>
          )}
          {isPreviewVisible && fileUrl && (
            <div className="w-full flex flex-col items-center">
              <button
                onClick={handleClosePreview}
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Cerrar Previsualización
              </button>
              <iframe
                src={fileUrl}
                title={`Documento ${id}`}
                width="100%"
                height="600px"
              />
            </div>
          )}
        </div>
      </div>
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
    </>
  );
}

export default FileDetail;
