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
import AnnulledInvoiceForm from "../components/Invoices/AnnulledInvoiceModal";
import Navbar from "../components/Navbar";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { MdMenu } from "react-icons/md";

const Invoices = ({ api }) => {
  const [dataBoard, setDataBoard] = useState({ results: [] });
  const [showCreateForm, setCreateShowForm] = useState(false);
  const [showCancelForm, setCancelShowForm] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [error, setError] = useState(null); // Estado de error
  const [loading, setLoading] = useState(false); // Estado de carga
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSidemenu, setShowSideMenu] = useState(false);

  // Muestra todas los datos de las facturas
  const getPipelines = useCallback(async () => {
    setLoading(true); // Carga inicial

    try {
      const response = await fetch(`${api}/invoices/recent`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });
      //Error handling
      if (!response.ok) throw new Error("Error en la petición");
      //Data handling
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

  const handleOpenCreateForm = () => setCreateShowForm(true);

  const handleAnnulledForm = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setCancelShowForm(true);
  };

  // if (loading) {
  //   return <LoadingScreen message="Cargando..." />; // Pantalla de carga
  // }

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen message={"Cargando facturas..."} />}
      </AnimatePresence>

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
            <h2 className={styles.heading_page}>Facturas</h2>
            <div className={styles.button_header_container}>
              <button
                onClick={handleOpenCreateForm}
                className={styles.button_header}
              >
                <FaPlus /> <span className="hidden sm:inline-block">Agregar Factura</span>
              </button>
            </div>
          </div>
          <InvoicesTable
            dataBoard={dataBoard}
            invoiceStatus={1}
            handleAnnulledForm={handleAnnulledForm}
            adminStatus={1}
          />
          <InvoicesTable
            dataBoard={dataBoard}
            invoiceStatus={2}
            adminStatus={1}
          />
          <InvoicesTable
            dataBoard={dataBoard}
            invoiceStatus={3}
            adminStatus={1}
          />
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className={styles.form_container}>
          <div className={styles.form_modal_bg}></div>
          <CreateInvoiceForm
            api={api}
            setCreateShowForm={setCreateShowForm}
            getPipelines={getPipelines}
            setSuccessMessage={setSuccessMessage}
            setSuccess={setSuccess}
            setLoading={setLoading} //Campos No Definidos
            //setLoadingMessage={setLoadingMessage}
            setErrorGeneral={setError}
          />
        </div>
      )}

      {/* Annulled Form Modal */}
      {showCancelForm && (
        <div className={styles.form_container}>
          <div className={styles.form_modal_bg}></div>
          <AnnulledInvoiceForm
            setCancelShowForm={setCancelShowForm}
            api={api}
            invoiceId={selectedInvoiceId}
            setSuccess={setSuccess}
            setSuccessMessage={setSuccessMessage}
            setError={setError}
          />
        </div>
      )}

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
};

export default Invoices;