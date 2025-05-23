import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import InvoicesDetailsTable from "../components/Invoices/InvoicesDetailsTable";
import InvoicesDetailsDocs from "../components/Invoices/InvoicesDetailsDocs";

import styles from "../styles";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";
import SuccessToast from "../components/SuccessToast";
import { SuccessTexts } from "../constants/Texts";
import ErrorToast from "../components/ErrorToast";

function InvoicesUserDetails({ api }) {
  const { userId, invoiceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(false);
  const [dataInvoice, setDataInvoice] = useState({});
  const [dataSender, setDataSender] = useState({});
  const [dataReceiver, setDataReceiver] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [hasVisited, setHasVisited] = useState(null);

  //Muestra todo los datos de texto de la factura, del emisor y del receptor
  const getInvoiceData = useCallback(async () => {
    try {
      const response = await fetch(`${api}/invoices/byid/two/${invoiceId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });
      if (!response.ok) throw new Error("Error en la petición");
      const data = await response.json();
      console.log(data);
      setHasVisited(data.pipeline.status); // Para saber si se avanza de status de (Iniciado => En Proceso)
      setDataInvoice(data.pipeline); //Datos de la Factura
      setDataSender(data.sender); //Datos de Emisor
      setDataReceiver(data.receiver) //Datos de Receptor
    } catch (error) {
      setError("Error al obtener los datos de la factura");
      console.error("Error al obtener los datos de la factura:", error);
    }
  }, [api, invoiceId, setError]);

  //Muestra todo los archivos de la factura
  const getDocsData = useCallback(async () => {
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
      setError("Error al obtener el documentos");
      console.error("Error al obtener documentos:", error);
    }
  }, [api, invoiceId, setError]);

  //Carga los datos al renderizar
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await getInvoiceData();
      await getDocsData();
      setLoading(false);
    };
    if (invoiceId) fetchAllData();
  }, [getInvoiceData, getDocsData, invoiceId, setLoading,]);

  //Si es la primera vez que el USUARIO ha visto la factura, actulizamos status (Iniciado => En proceso)
  const sendProgress = async () => {
    try {
      const response = await fetch(`${api}/invoices/user/process/${invoiceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });

      if (!response.ok) throw new Error("Error al actulizar estatus(Init=>Proceso)");
      const data = await response.json(); //Quitarlo
      console.log("Progreso enviado al backend:", data); // Quitalo
    } catch (error) {
      console.error("Error al enviar la información al backend:", error);
    }
  };

  //Espera a que hasVisited tenga valor y actulizamos status (Iniciado => En proceso)
  useEffect(() => {
    if (hasVisited === "Iniciado") {
      sendProgress();
    }
  }, [hasVisited]);

  //Si el USUARIO ha subido todas sus facturas, actulizamos status (En proceso => Finalizado)
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
      setSuccessMessage(SuccessTexts.process);
      setSuccess(true);
      // Opcional: refrescar datos
    } catch (err) {
      console.error(err);
      setError("Error al terminar el proceso");
    }
    finally {
      await getInvoiceData();
      setLoading(false); // Carga finalizada
    }
  };

  //Peticion POST para subir un tipo de archivos a Factura
  const handleDocInvoiceUpload = async (file, docType) => {
    console.log(`Archivo ${docType}:`, file);
    const formData = new FormData();
    formData.append("document_type", docType);
    formData.append("invoice_id", invoiceId);
    formData.append("DocInvoice", file);
    setLoading(true); // Carga inicial
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
      setSuccessMessage(SuccessTexts.fileUpload);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(`Error al subir archivo ${docType}`);
    } finally {
      try {
        await getDocsData(); //Hasta que se refrequen los nuevos datos hace el finally
      }
      finally {
        setLoading(false);// Carga finalizada
      }
    }
  };


  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen message={"Cargando..."} />}
      </AnimatePresence>
      <div className={styles.blank_page}>
        <Navbar />
        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_details_page}>Facturas</h2>
          </div>
          <InvoicesDetailsTable
            invoice={dataInvoice}
            sender={dataSender}
            receiver={dataReceiver}
          />
          <InvoicesDetailsDocs
            uploadedDocs={uploadedDocs}
            handleDocInvoiceUpload={handleDocInvoiceUpload}
            handleFinished={handleFinished}
            setError={setError}
            hasVisited={hasVisited}
          />
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
}

export default InvoicesUserDetails;
