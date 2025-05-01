import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import SideMenu from "../../components/SideMenu";
import Cookies from "js-cookie";
import { SiGoogledocs } from "react-icons/si";
import FilesTableDetail from "./FileTableDetail.jsx";
import ErrorToast from "../ErrorToast.jsx";
import SuccessToast from "../SuccessToast.jsx";
import { AnimatePresence } from "framer-motion";
import { FaEdit } from "react-icons/fa";

import LoadingScreen from "../LoadingScreen.jsx";
import styles from "../../styles.js";

const FormattedDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  return formattedDate;
};

function FileDetail({ api }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [fileUrl, setFileUrl] = useState({ urls: [] }); //Estado para manejar las descargas de los archivos
  const [newData, setNewData] = useState({ results: [] }); //Estado para manejar los nuevos datos del formulario
  const [userAssigns, setuserAssigns] = useState({ results: [] }); //Estado para manejar los usuarios asignados en el dropdown
  const [isEditing, setIsEditing] = useState(false); // Estado para determinar si estamos editando
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const getUsers = useCallback(async () => {
    const response = await fetch(`${api}/users/byregnact`, {
      method: "GET",
      headers: { "x-access-token": Cookies.get("token") },
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  }, [api]);

  const getClients = useCallback(async () => {
    const response = await fetch(`${api}/clients/byclientanduser/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": Cookies.get("token"),
      },
    });
    if (!response.ok) throw new Error("Error al obtener Expediente");
    return await response.json();
  }, [api, id]);

  const getFileDetail = useCallback(async () => {
    const response = await fetch(`${api}/docs/byid/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": Cookies.get("token"),
      },
    });
    if (!response.ok) throw new Error("Error al obtener el Documento");
    return await response.json();
  }, [api, id]);

  useEffect(() => {
    const getAllData = async () => {
      setLoading(true);
      setError(null); // limpiar errores anteriores

      try {
        const [usersData, clientsData, fileData] = await Promise.all([
          getUsers(),
          getClients(),
          getFileDetail(),
        ]);

        setuserAssigns(usersData);
        setNewData(clientsData);
        setFileUrl(fileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAllData();
  }, [getUsers, getClients, getFileDetail]);

  // Manejo de errores
  // if (error) {
  //     return (
  //         <div className="flex items-center justify-center h-screen">
  //             <p className="text-red-500 text-xl font-semibold">{error}</p>
  //         </div>
  //     );
  // }

  // console.log(newData);//Quitarlo
  // console.log('data', userAssigns);

  const documentTypeMap = {
    CSF: "CSF",
    CDD: "Comprobante Domicilio",
    CDB: "Caratula Bancaria",
  };

  //Peticion para enviar los nuevos datos del edit
  const handleSaveChanges = async (updatedData) => {
    try {
      const response = await fetch(
        `${api}/clients/update/byclientanduser/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": Cookies.get("token"),
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar los datos");

      const result = await response.json();
      // setNewFiles({ results: result });
      console.log(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsEditing(false); // Finaliza la edición
      setSuccess(true);
      setSuccessMessage("Datos actualizados exitosamente");
    }
  };

  //Función para Actulizar el archivo
  const handleFileUpload = async (file, documentId) => {
    // setLoading(true); // Carga finalizada
    const formData = new FormData();
    formData.append("document", file);

    console.log("Contenido de FormData Antes de:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await fetch(`${api}/docs/update/${documentId}`, {
        method: "PUT",
        headers: {
          "x-access-token": Cookies.get("token"),
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir el archivo");

      const data = await response.json();
      console.log("Archivo subido:", data);
      //alert("Archivo actualizado exitosamente");

      // Refresca la lista de archivos
      const updatedDocs = await fetch(`${api}/docs/byid/${id}`, {
        headers: {
          "x-access-token": Cookies.get("token"),
        },
      });
      const updatedRes = await updatedDocs.json();
      setFileUrl(updatedRes);
    } catch (err) {
      setError(err.message);
      alert("Hubo un error al subir el archivo");
    } finally {
      setSuccessMessage("Archivo actualizado exitosamente");
      setSuccess(true);
    }
  };

  console.log(fileUrl);

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <div className={styles.blank_page}>
        <div className="w-64">
          <SideMenu />
        </div>
        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>{newData.results.name_rs}</h2>
            {/* <h2 className={styles.heading_page}>Expediente No. {id}</h2> */}
            {!isEditing && (
              <div className={styles.button_header_container}>
                <button
                  className={styles.button_header}
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit /> Editar Datos
                </button>
              </div>
            )}
          </div>
          {/* Detalles del expediente */}
          <div className="w-full mb-6">
            <FilesTableDetail
              data={newData}
              onSave={handleSaveChanges}
              userAssigns={userAssigns.results}
              setLoading={setLoading}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>

          {/*Detalles de Documento */}
          <section className="bg-white shadow-sm border border-gray-200 w-[80%] mx-auto rounded-lg py-10 px-5 grid grid-cols-1 lg:grid-cols-3 gap-6 place-items-center grid-cols-auto justify-items-center">
            {fileUrl.urls.map((urls) => (
              <article
                key={urls.document_id}
                style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                className="flex flex-col items-center justify-center w-[90%] max-w-xd  bg-whiteN rounded-lg"
              >
                {/* Contenido con padding */}
                <div className="w-full px-4 py-4 flex flex-col items-center">
                  <header className="flex flex-col items-center">
                    <SiGoogledocs className="w-24 h-24 my-2 text-gray-800" />
                    <h3 className="text-center font-semibold font-inter text-lg text-gray-800 md:text-base">
                      {documentTypeMap[urls.document_type] ||
                        urls.document_type}
                    </h3>
                    <time
                      className="text-sm text-gray-600 italic font-inter"
                      dateTime={urls.created_at}
                    >
                      ({FormattedDate(urls.created_at)})
                    </time>
                  </header>
                </div>

                <hr className="w-full border-t-6 border-white" />

                <div className="w-full px-4 mt-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-3 text-center justify-center">
                  <a
                    href={urls.signedUrl}
                    download={`${urls.document_type}-${id}`}
                    className="cursor-pointer downloadButton text-white px-3 py-1 rounded font-medium font-inter w-full shadow-md shadow-blue-700/60 hover:scale-110 hover:font-semibold transition-all"
                  >
                    Descargar
                  </a>

                  <label
                    htmlFor={`upload-${urls.document_id}`}
                    className="cursor-pointer updateButton text-white px-3 py-1 rounded font-medium font-inter w-full shadow-md shadow-yellow-700/40 hover:scale-110 hover:font-semibold transition-all"
                  >
                    Actualizar
                  </label>
                  <input
                    id={`upload-${urls.document_id}`}
                    type="file"
                    accept="application/pdf, pdf"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleFileUpload(file, urls.document_id);
                      }
                    }}
                  />
                </div>
                <div className="mb-4"></div>
              </article>
            ))}
          </section>
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
}

export default FileDetail;
