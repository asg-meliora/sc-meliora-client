import React, { useCallback, useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import styles from "../styles";
import { FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";

import LoadingScreen from "../components/LoadingScreen";
import { AnimatePresence } from "framer-motion";

import InvoicesTable from "../components/Invoices/InvoicesTable";
//import { invoicesData } from "../constants";

import CreateInvoiceForm from "../components/Invoices/CreateInvoiceForm";
import CancelInvoiceForm from "../components/Invoices/CancelInvoiceForm";

const Invoices = ({ api }) => {
  const [dataBoard, setDataBoard] = useState({ results: [] });
  const [showCreateForm, setCreateShowForm] = useState(false);
  const [showCancelForm, setCancelShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPipelines = useCallback(async () => {
    setLoading(true); // Carga inicial

    try {
      const response = await fetch(`${api}/invoices`, {
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
  }, [api]);

  useEffect(() => {
    getPipelines();
  }, [getPipelines]);
  
  const handleOpenCreateForm = () => {
    setCreateShowForm(true);
  };

  const handleOpenCancelForm = () => {
    setCancelShowForm(true);
  };

  if (loading) {
    return <LoadingScreen message="Cargando..." />; // Pantalla de carga
  }

  return (
    <>
      {/* <AnimatePresence>{loading && <LoadingScreen message={loadingMessage} />}</AnimatePresence> */}

      <div className={styles.blank_page}>
        <div className="w-64">
          <SideMenu />
        </div>

        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Facturas</h2>
            <div className={styles.button_header_container}>
              <button
                onClick={handleOpenCreateForm}
                className={styles.button_header}
              >
                <FaPlus /> Agregar Factura
              </button>
            </div>
          </div>
          <InvoicesTable
            dataBoard={dataBoard}
            invoiceStatus={1}
            handleOpenCancelForm={handleOpenCancelForm}
            adminStatus={1}
          />
          <InvoicesTable dataBoard={dataBoard} invoiceStatus={2} adminStatus={1}/>
          <InvoicesTable dataBoard={dataBoard} invoiceStatus={3} adminStatus={1}/>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className={styles.form_container}>
          <div className={styles.form_modal_bg}></div>
          <CreateInvoiceForm api={api} setCreateShowForm={setCreateShowForm} />
        </div>
      )}

      {/* Cancel Form Modal */}
      {showCancelForm && (
        <div className={styles.form_container}>
          <div className={styles.form_modal_bg}></div>
          <CancelInvoiceForm setCancelShowForm={setCancelShowForm} />
        </div>
      )}
    </>
  );
};

export default Invoices;
