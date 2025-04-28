import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import SideMenu from "../../components/SideMenu";
import Cookies from "js-cookie";
import { SiGoogledocs } from "react-icons/si";
import FilesTableDetail from "./FileTableDetail.jsx";
import ErrorToast from "../ErrorToast.jsx";
import { AnimatePresence } from "framer-motion";

import LoadingScreen from "../LoadingScreen.jsx";

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

  const fetchUsers = useCallback(async () => {
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
    const fetchAllData = async () => {
      setLoading(true);
      setError(null); // limpiar errores anteriores
  
      try {
        const [usersData, clientsData, fileData] = await Promise.all([
          fetchUsers(),
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
  
    fetchAllData();
  }, [fetchUsers, getClients, getFileDetail]);
  
  

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
      alert("Exitosamente exitoso");
    } catch (err) {
      setError(err.message);
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
      // setLoading(false); // Carga finalizada
    }
  };
  

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <SideMenu className="w-full md:w-1/4" />

        {/* Contenido principal */}
        <div className="flex-1 w-full md:w-3/4 p-4 flex flex-col items-center">
          <div className="w-full max-w-screen-xl">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Expediente No. {id}
            </h1>

            {/* Detalles del expediente */}
            <div className="w-full mb-6">
              <FilesTableDetail
                data={newData}
                onSave={handleSaveChanges}
                userAssigns={userAssigns.results}
                setLoading={setLoading}
              />
            </div>

            {/* Mensaje de error
            {error && <p className="text-red-500 text-center">{error}</p>} */}

            {/*Detalles de Documento */}
            <section className="bg-blue-500 rounded-lg mt-18 py-10 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fileUrl.urls.map((urls) => (
                <article
                  key={urls.document_id}
                  className="flex flex-col items-center justify-center w-full h-54 bg-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                >
                  {/* Sección de Información */}
                  <header className="flex flex-col items-center">
                    <SiGoogledocs className="w-24 h-24 my-2" />
                    <h3 className="text-center font-medium">
                      {documentTypeMap[urls.document_type] ||
                        urls.document_type}
                    </h3>
                    <time
                      className="text-sm text-gray-600"
                      dateTime={urls.created_at}
                    >
                      ({FormattedDate(urls.created_at)})
                    </time>
                  </header>

                  <footer className="flex gap-3 mt-4">
                    <a
                      href={urls.signedUrl}
                      download={`${urls.document_type}-${id}`}
                      className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Descargar
                    </a>

                    {/* Botón para subir nuevo archivo */}
                    <label
                      htmlFor={`upload-${urls.document_id}`}
                      className="cursor-pointer bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
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
                  </footer>
                </article>
              ))}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default FileDetail;
