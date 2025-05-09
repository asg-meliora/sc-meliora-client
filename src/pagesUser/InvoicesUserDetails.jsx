import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import InvoicesDetailsTable from "../components/Invoices/InvoicesDetailsTable";

import styles from "../styles";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";

function InvoicesUserDetails({ api }) {
  const { userId, invoiceId } = useParams();
  const [loading, setLoading] = useState(false);

  //TODO: cambiar a useCallback y cambiar el uso de localStorage por otra forma de guardar el progreso
  useEffect(() => {
    const sendProcess = async () => {
      const key = `hasVisited_${invoiceId}`;
      const hasVisited = localStorage.getItem(key);

      if (!hasVisited) {
        localStorage.setItem(key, "true");

        try {
          const response = await fetch(
            `${api}/invoices/user/process/${invoiceId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "x-access-token": Cookies.get("token"),
              },
            }
          );
          if (!response.ok) throw new Error("Error en la petición");

          const data = await response.json();
          console.log("Progreso enviado al backend:", data); // Quitalo
        } catch (error) {
          console.error("Error al enviar la información al backend:", error);
        }
      }
    };

    sendProcess();
  }, [api, invoiceId]);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen message={"Cargando..."} />}
      </AnimatePresence>
      <div className={styles.blank_page}>
        <Navbar />
        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Facturas</h2>
          </div>
          <InvoicesDetailsTable
            api={api}
            userId={userId}
            invoiceId={invoiceId}
            setLoading={setLoading}
          />
        </div>
      </div>
    </>
  );
}

export default InvoicesUserDetails;
