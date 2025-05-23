import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import InvoicesDetailsTable from "../Invoices/InvoicesDetailsTable";
import InvoicesDetailsDocs from "../Invoices/InvoicesDetailsDocs";

import styles from "../../styles";
import Navbar from "../../components/Navbar";

import { AnimatePresence } from "framer-motion";
import LoadingScreen from "../LoadingScreen";

function InvoicesDetails({ api }) {
  const { invoiceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
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
            setError={setError}
            hasVisited={hasVisited}
            adminStatus={1}
          />
        </div>
      </div>
    </>
  )
}

export default InvoicesDetails;
