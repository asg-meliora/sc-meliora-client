import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import styles from "../styles";

import InvoicesTable from "../components/Invoices/InvoicesTable";
import Navbar from "../components/Navbar";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";

function InvoicesUser({ api }) {
  useEffect(() => {
      const hasReloaded = sessionStorage.getItem("hasReloaded");
  
      if (!hasReloaded) {
        sessionStorage.setItem("hasReloaded", "true");
        window.location.reload();
      }
    }, []);
    
  const { userId } = useParams();
  const [dataBoard, setDataBoard] = useState({ results: [] });
  const [error, setError] = useState(null); // Estado de error
  const [loading, setLoading] = useState(false);
  

  const getPipelines = useCallback(async () => {
    setLoading(true); // Carga inicial

    try {
      const response = await fetch(`${api}/invoices/user/byid/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });

      //Error handling
      if (!response.ok) throw new Error("Error en la petición");

      const data = await response.json();
      setDataBoard(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Carga finalizada
    }
  }, [api, userId]);

  useEffect(() => {
    getPipelines();
  }, [getPipelines]);

  // if (loading) {
  //   return <LoadingScreen message="Cargando..." />; // Pantalla de carga
  // }

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen message={"Cargando información"} />}
      </AnimatePresence>

      <div className={styles.blank_page}>
        <Navbar />

        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Facturas</h2>
          </div>
          <InvoicesTable
            dataBoard={dataBoard}
            invoiceStatus={1}
            adminStatus={0}
          />
          <InvoicesTable
            dataBoard={dataBoard}
            invoiceStatus={2}
            adminStatus={0}
          />
          <InvoicesTable
            dataBoard={dataBoard}
            invoiceStatus={3}
            adminStatus={0}
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
    </>
  );
}

export default InvoicesUser;
