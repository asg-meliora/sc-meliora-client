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
import Navbar from "../Navbar.jsx";
import { SuccessTexts } from "../../constants/Texts.js";
import { MdMenu } from "react-icons/md";

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
  const [showSidemenu, setShowSideMenu] = useState(false);

  const getUsers = useCallback(async () => {
    const response = await fetch(`${api}/users/byregnact`, { //Mostrar usuarios disponibles para asignar
      method: "GET",
      headers: { "x-access-token": Cookies.get("token") },
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  }, [api]);

  const getClients = useCallback(async () => { //Mostrar Datos del Cliente
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

  const getFileDetail = useCallback(async () => { //Mostrar Archivos del Cliente
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
        console.log(clientsData);
        setFileUrl(fileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAllData();
  }, [getUsers, getClients, getFileDetail]);

  const documentTypeMap = {
    CSF: "CSF",
    CDD: "Comprobante Domicilio",
    CDB: "Caratula Bancaria",
  };

  //Peticion para enviar los nuevos datos del edit //Todo VALIDACIONES EN FRONT ANTES DE ENVIAR AL BACK
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
      console.log("Updated", result); //Quitarlo
      // setNewFiles({ results: result });
      setSuccess(true);
      setSuccessMessage(SuccessTexts.filesModify);
    } catch (err) {
      setError(err.message);
    } finally {
      const updatedClientData = await getClients();
      setNewData(updatedClientData);
      setIsEditing(false);
    }
  };

  //Función para Actulizar el archivo
  const handleFileUpload = async (file, documentId) => {
    setLoading(true); // Carga Iniciada
    const formData = new FormData();
    formData.append("document", file);

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

      // Refresca la lista de archivos
      const updatedDocs = await fetch(`${api}/docs/byid/${id}`, {
        headers: {
          "x-access-token": Cookies.get("token"),
        },
      });
      const updatedRes = await updatedDocs.json();
      setFileUrl(updatedRes);
      setSuccess(true);
      setSuccessMessage(SuccessTexts.fileUpdate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Carga Finalizada
    }
  };

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
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
            <h2 className={styles.heading_details_page}>
              {newData.results.name_rs}
            </h2>
            {/* <h2 className={styles.heading_page}>Expediente No. {id}</h2> */}
            {!isEditing ? (
              <div className={styles.button_header_container}>
                <button
                  className={styles.button_header}
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit />{" "}
                  <span className="hidden sm:inline-block">Editar Datos</span>
                </button>
              </div>
            ) : <div></div>}
          </div>
          {/* Detalles del expediente */}
          <div className="w-full mb-6">
            <FilesTableDetail
              data={newData.results}
              onSave={handleSaveChanges}
              userAssigns={userAssigns.results}
              setLoading={setLoading}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>

          {/*Detalles de Documento */}
          <section className={styles.d_files_container}>
            {fileUrl.urls.map((urls) => (
              <article
                key={urls.document_id}
                style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                className={styles.d_files_article}
              >
                <div className={styles.d_files_info_container}>
                  <header className={styles.d_files_info_header}>
                    <SiGoogledocs className={styles.d_files_info_icon} />
                    <h3 className={styles.d_files_info_title}>
                      {documentTypeMap[urls.document_type] ||
                        urls.document_type}
                    </h3>
                    <time
                      className={styles.d_files_info_date}
                      dateTime={urls.created_at}
                    >
                      ({FormattedDate(urls.created_at)})
                    </time>
                  </header>
                </div>

                <hr className={styles.d_files_hr} />

                <div className={styles.d_files_buttons_container}>
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
                      const maxSizeMB = 2;
                      const maxSizeBytes = maxSizeMB * 1024 * 1024; //Limite de tamaño de archivo 2MB

                      if (file) {
                        const isPdf = file.type === "application/pdf";
                        if (!isPdf) {
                          setError("Solo se permiten archivos en formato PDF"); //Rechazar si no es pdf
                        } else if (file.size > maxSizeBytes) {
                          setError(
                            `El archivo supera el límite de ${maxSizeMB}MB`
                          ); //Rechazar si pesa mucho
                        } else {
                          handleFileUpload(file, urls.document_id); //Subir Archivo
                        }
                      }
                      e.target.value = null; //Resetear cualquier archivo cargado local
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
