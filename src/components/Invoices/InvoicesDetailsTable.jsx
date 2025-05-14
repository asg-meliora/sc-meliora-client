import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SiGoogledocs, SiStyleshare } from "react-icons/si";
import LoadingScreen from "../LoadingScreen";
import styles from "../../styles";
import { AnimatePresence } from "framer-motion";
import { formatDate, set } from "date-fns";

const FormattedDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
  return formattedDate;
};

function InvoicesDetailsTable({
  api,
  userId,
  invoiceId,
  setLoading,
  setSuccess,
  setSuccessMessage,
  setError,
}) {
  const [dataInvoice, setDataInvoice] = useState({}); // Estado para los datos de la factura
  const [clientSenderId, setClientSenderId] = useState(null);
  const [clientReceiverId, setClientReceiverId] = useState(null);
  const [dataClientSender, setDataClientSender] = useState({});
  const [dataClientReceiver, setDataClientReceiver] = useState({});

  const [uploadedDocs, setUploadedDocs] = useState({});

  const getInvoiceData = useCallback(async () => {
    try {
      const response = await fetch(`${api}/invoices/byid/${invoiceId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });
      if (!response.ok) throw new Error("Error en la petición");
      const data = await response.json();
      setDataInvoice(data.results[0]);
      setClientSenderId(data.results[0].client_sender_id);
      setClientReceiverId(data.results[0].client_receiver_id);
    } catch (error) {
      setError("Error al obtener los datos de la factura");
      console.error("Error al obtener los datos de la factura:", error);
    }
  }, [api, invoiceId, setError]);

  const getClientSenderData = useCallback(async () => {
    if (!clientSenderId) return;
    try {
      const res = await fetch(
        `${api}/clients/byclientanduser/${clientSenderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": Cookies.get("token"),
          },
        }
      );
      if (!res.ok) throw new Error("Error en la petición del cliente emisor");
      const data = await res.json();
      setDataClientSender(data.results);
    } catch (error) {
      setError("Error al obtener el cliente emisor");
      console.error("Error al obtener el cliente emisor:", error);
    }
  }, [api, clientSenderId, setError]);

  const getClientReceiverData = useCallback(async () => {
    if (!clientReceiverId) return;
    try {
      const res = await fetch(
        `${api}/clients/byclientanduser/${clientReceiverId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": Cookies.get("token"),
          },
        }
      );
      if (!res.ok) throw new Error("Error en la petición del cliente receptor");
      const data = await res.json();
      setDataClientReceiver(data.results);
    } catch (error) {
      setError("Error al obtener el cliente receptor");
      console.error("Error al obtener el cliente receptor:", error);
    }
  }, [api, clientReceiverId, setError]);

  const fetchUploadedDocs = useCallback(async () => {
    try {
      const res = await fetch(`${api}/invoices/user/docs/${invoiceId}`, {
        headers: {
          "x-access-token": Cookies.get("token"),
        },
      });
      if (!res.ok) throw new Error("Error al obtener documentos");
      const data = await res.json();
      setUploadedDocs(data);
    } catch (error) {
      //   setError("Error al obtener el documentos"); TODO When there are files has to exist
      console.error("Error al obtener documentos:", error);
    }
  }, [api, invoiceId]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await getInvoiceData();
      await getClientSenderData();
      await getClientReceiverData();
      await fetchUploadedDocs();
      setLoading(false);
    };

    if (invoiceId) fetchAllData();
  }, [
    getInvoiceData,
    getClientSenderData,
    getClientReceiverData,
    fetchUploadedDocs,
    invoiceId,
    setLoading,
  ]);

  const DiccHead = {
    name_rs: "Razón Social",
    rfc: "RFC",
    curp: "CURP",
    address: "Dirección",
    // zip_code: "Código Postal",
    // phone: "Teléfono",
    // email: "Correo Electrónico",
    bank_account: "No. Cuenta Bancaria",
    // created_at: "Fecha de creación",
    user_name: "Usuario Asignado",
  };
  const Dicc2Head = {
    name_rs: "Razón Social",
    rfc: "RFC",
    curp: "CURP",
    address: "Dirección",
    // zip_code: "Código Postal",
    // phone: "Teléfono",
    // email: "Correo Electrónico",
    bank_account: "No. Cuenta Bancaria",
    // created_at: "Fecha de creación",
    // user_name: "Usuario Asignado",
  };
  const Dicc3Head = {
    pipeline_id: "ID",
    type_pipeline: "Tipo",
    concept: "Concepto",
    total_amount: "Total",
    subtotal: "Subtotal",
    iva: "IVA",
    total_refund: "Total Devolución",
    comision: "Cantidad de Comisión",
    comision_percentage: "Porcentaje de Comisión",
    payment_type: "Tipo de pago",
    status: "Estatus",
    created_at: "Fecha de creación",
  };

  const DiccDocs = {
    PreXML: "Prefactura XML",
    FacXML: "Factura XML",
    PrePDF: "Prefactura PDF",
    FacPDF: "Factura PDF",
  };

  // const client = { ...data, created_at: FormattedDate(data.created_at) }; // Simulación de datos de la API

  // console.log(client); //Quitarlo
  // const [item, setItem] = useState(client); // Estado para los datos

  // Divide las claves en dos mitades
  const keys = Object.keys(DiccHead); // Orden de los campos
  const half = Math.ceil(keys.length / 2);
  const leftKeys = keys; // Primera mitad de las claves
  const rightKeys = Object.keys(Dicc2Head); //(keys)
  const facturaKeys = Object.keys(Dicc3Head); //(keys)

  // Lista de los 4 tipos de documentos
  const documentTypes = ["PreXML", "PrePDF", "FacXML", "FacPDF"];

  const handleDocInvoiceUpload = async (e, docType) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    //console.log(`Archivo ${docType}:`, file);
    const formData = new FormData();
    formData.append("document_type", docType);
    formData.append("invoice_id", invoiceId);
    formData.append("DocInvoice", file);

    try {
      const res = await fetch(`${api}/invoices/user/docs/${invoiceId}`, {
        method: "POST",
        headers: {
          "x-access-token": Cookies.get("token"),
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir archivo");

      const result = await res.json();
      setSuccessMessage("Archivo subido correctamente");
      setSuccess(true);
      // Opcional: refrescar datos
    } catch (err) {
      console.error(err);
      alert(`Error al subir archivo ${docType}`);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleFinished = async () => {
    setLoading(true); // Carga inicial
    try {
      const res = await fetch(`${api}/invoices/user/finished/${invoiceId}`, {
        method: "PATCH",
        headers: {
          "x-access-token": Cookies.get("token"),
        },
      });

      if (!res.ok) throw new Error("Error al subir archivo");

      const result = await res.json();
      setSuccessMessage("Proceso terminado correctamente");
      setSuccess(true);
      // Opcional: refrescar datos
    } catch (err) {
      console.error(err);
      setError("Error al terminar el proceso");
    }
    setLoading(false); // Carga finalizada
  };

  const isAllDocsUploaded = documentTypes.every(
    (docType) => uploadedDocs[docType]
  );

  const validateDoc = (docType, file) => {
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (docType === "XML") {
      if (!file.name.endsWith(".xml")) {
        setError("El archivo debe tener extensión .xml");
        return false;
      }
    } else if (docType === "PDF") {
      if (!file.name.endsWith(".pdf")) {
        setError("El archivo debe tener extensión .pdf");
        return false;
      }
    } else {
      setError("Tipo de documento no válido");
      return false;
    }

    if (file.size > maxSize) {
      setError("El archivo debe ser menor a 2MB.");
      return false;
    }

    return true;
  };

  return (
    <>
      {/* <div>InvoicesUserDetails {userId}/{invoiceId}</div> */}
      <div className={`${styles.d_table_container}`}>
        {/* Tabla izquierda */}
        <div className={`${styles.d_table_column_container}`}>
          <h2 className={`${styles.d_table_heading}`}>Datos Emisor</h2>
          <table
            className={`table-fixed border-separate border-spacing-0 border-6  border-[#F4F4F7] rounded-md min-w-[300px]`} /*table-fixed*/
          >
            <tbody>
              {leftKeys.map((key) => (
                <tr key={key} className="align-center">
                  <th
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_header} border-b-6`}
                  >
                    {DiccHead[key]}
                  </th>
                  <td
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_data} border-b-6`}
                  >
                    {dataClientSender[key] ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Tabla Izquierda Inferior */}
          <div className="w-full  overflow-x-auto my-4">
            <h2 className={`${styles.d_table_heading}`}>Datos Receptor</h2>
            <table className={`${styles.d_table}`} /*table-fixed*/>
              <tbody>
                {rightKeys.map((key) => (
                  <tr key={key} className="align-center">
                    <th
                      style={{
                        boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)",
                      }}
                      className={`${styles.d_table_header} border-b-6`}
                    >
                      {Dicc2Head[key]}
                    </th>
                    <td
                      style={{
                        boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)",
                      }}
                      className={`${styles.d_table_data} border-b-6`}
                    >
                      {dataClientReceiver[key] ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full lg:w-1/2 overflow-x-auto ">
          <h2 className={`${styles.d_table_heading}`}>Datos de la factura</h2>
          <table
            className="w-full h-[93%] table-fixed border-separate border-spacing-0 border-6  border-[#F4F4F7] rounded-md min-w-[300px]" /*table-fixed*/
          >
            <tbody>
              {facturaKeys.map((key) => (
                <tr key={key} className="align-center">
                  <th
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_header} border-b-6`}
                  >
                    {Dicc3Head[key]}
                  </th>
                  <td
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_data} border-b-6`}
                  >
                    {dataInvoice[key] == null
                      ? "—"
                      : key === "created_at"
                      ? FormattedDate(dataInvoice[key])
                      : dataInvoice[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botón de Terminado */}
      {isAllDocsUploaded && userId >= 0 && (
        <div className="flex justify-center">
          <button
            className="px-5 py-3 mt-[-20px] mb-[25px] rounded-xl confirmButton text-white text-xl font-medium font-inter shadow-md shadow-green-800/50 hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
            onClick={handleFinished}
          >
            Finalizar Proceso
          </button>
        </div>
      )}

      {/* Todos los Documentos */}
      <section className="w-[95%] mx-auto py-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-8 mt-[-15px]">
        {/* Sección Prefactura */}
        <div className="w-full mt-[-25px] px-6 py-4 bg-white shadow-sm border border-gray-200 rounded-lg">
          <h2 className="text-3xl font-semibold font-inter text-gray-700 mb-2 text-center">
            Prefactura
          </h2>
          <div className="flex flex-row gap-6 items-center">
            {["PreXML", "PrePDF"].map((item) => (
              <article
                key={item}
                style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                className={styles.d_files_article}
              >
                <header className={styles.d_files_info_header}>
                  <SiGoogledocs className={styles.d_files_info_icon} />
                  <h3 className={styles.d_files_info_title}>
                    Archivo {DiccDocs[item]}
                  </h3>
                  <p className={styles.d_files_info_date}>
                    {userId >= 0
                      ? `(Subir Archivo ${
                          item.endsWith("XML") ? ".xml" : ".pdf"
                        })`
                      : "(Archivo Faltante)"}
                  </p>
                </header>
                <hr className={styles.d_files_hr} />
                <footer className={styles.d_files_buttons_container}>
                  {uploadedDocs[item] ? (
                    <a
                      className="cursor-pointer downloadButton text-white px-3 py-1 rounded font-medium font-inter w-[50%] shadow-md shadow-blue-700/60 hover:scale-110 hover:font-semibold transition-all"
                      href={uploadedDocs[item]}
                    >
                      Ver archivo
                    </a>
                  ) : (
                    userId >= 0 && (
                      <>
                        <label
                          htmlFor={`upload-file-${item}`}
                          className="cursor-pointer updateButton text-white px-3 py-1 text-sm rounded font-medium font-inter w-[80%] shadow-md shadow-yellow-700/40 hover:scale-110 hover:font-semibold transition-all"
                        >
                          Seleccionar archivo
                        </label>
                        <input
                          id={`upload-file-${item}`}
                          type="file"
                          hidden
                          accept={item.includes("XML") ? ".xml" : ".pdf"}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const type = item.includes("XML") ? "XML" : "PDF";

                            if (!validateDoc(type, file)) {
                              e.target.value = ""; // Limpiar si falla la validación
                              return;
                            }
                            handleDocInvoiceUpload(e, item);
                          }}
                        />
                      </>
                    )
                  )}
                </footer>
                <div className="mb-4"></div>
              </article>
            ))}
          </div>
        </div>

        {/* Sección Factura */}
        <div className="w-full mt-[-25px] px-6 py-4 bg-white shadow-sm border border-gray-200 rounded-lg">
          <h2 className="text-3xl font-semibold font-inter text-gray-700 mb-2 text-center">
            Factura
          </h2>
          <div className="flex flex-row gap-6 items-center">
            {["FacXML", "FacPDF"].map((item) => (
              <article
                key={item}
                style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                className={styles.d_files_article}
              >
                <header className={styles.d_files_info_header}>
                  <SiGoogledocs className={styles.d_files_info_icon} />
                  <h3 className={styles.d_files_info_title}>
                    Archivo {DiccDocs[item]}
                  </h3>
                  <p className={styles.d_files_info_date}>
                    {userId >= 0
                      ? `(Subir Archivo ${
                          item.endsWith("XML") ? ".xml" : ".pdf"
                        })`
                      : "(Archivo Faltante)"}
                  </p>
                </header>
                <hr className={styles.d_files_hr} />
                <footer className={styles.d_files_buttons_container}>
                  {uploadedDocs[item] ? (
                    <a
                      className="cursor-pointer downloadButton text-white px-3 py-1 rounded font-medium font-inter w-[50%] shadow-md shadow-blue-700/60 hover:scale-110 hover:font-semibold transition-all"
                      href={uploadedDocs[item]}
                    >
                      Ver archivo
                    </a>
                  ) : (
                    userId >= 0 && (
                      <>
                        <label
                          htmlFor={`upload-file-${item}`}
                          className="cursor-pointer updateButton text-white px-3 py-1 text-sm rounded font-medium font-inter w-[80%] shadow-md shadow-yellow-700/40 hover:scale-110 hover:font-semibold transition-all"
                        >
                          Seleccionar archivo
                        </label>
                        <input
                          id={`upload-file-${item}`}
                          type="file"
                          hidden
                          accept={item.includes("XML") ? ".xml" : ".pdf"}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const type = item.includes("XML") ? "XML" : "PDF";

                            if (!validateDoc(type, file)) {
                              e.target.value = ""; // Limpiar si falla la validación
                              return;
                            }
                            handleDocInvoiceUpload(e, item);
                          }}
                        />
                      </>
                    )
                  )}
                </footer>
                <div className="mb-4"></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default InvoicesDetailsTable;
