import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import InvoicesDetailsTable from "../components/Invoices/InvoicesDetailsTable";

import styles from "../styles";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";

function InvoicesUserDetails({ api }) {
  const { userId, invoiceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(false);

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
            <h2 className={styles.heading_details_page}>Facturas</h2>
          </div>
          <InvoicesDetailsTable
            api={api}
            userId={userId}
            invoiceId={invoiceId}
            setLoading={setLoading}
            setSuccess={setSuccess}
            setSuccessMessage={setSuccessMessage}
            setError={setError}
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
