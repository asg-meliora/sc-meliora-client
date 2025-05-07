import React, { useCallback, useEffect, useState } from 'react';
import SideMenu from '../components/SideMenu'
import styles from '../styles';
import Cookies from 'js-cookie';
import LoadingScreen from "../components/LoadingScreen";

import HistoricalTable from '../components/Historical/HistoricalTable';
import CancelInvoiceForm from '../components/Historical/CancelInvoiceForm';

const Historical = ({ api }) => {
  const [dataBoard, setDataBoard] = useState([]); // Estado para almacenar los datos de la tabla
  const [loading, setLoading] = useState(true); // Estado de carga
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [showCancelForm, setCancelShowForm] = useState(false);

  const getHistorical = useCallback(async () => {
    setLoading(true); // Carga inicial

    try {
      const response = await fetch(`${api}/historical/finalized`, {
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
    getHistorical();
  }, [getHistorical]);

  const handleAnnulledForm = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setCancelShowForm(true);
  };

  if (loading) {
    return <LoadingScreen message="Cargando..." />; // Pantalla de carga
  }

  console.log('Data', dataBoard)

  return (
    <>
      <div className={styles.blank_page}>
        <div className="w-64">
          <SideMenu />
        </div>

        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Histórico</h2>
          </div>
          <HistoricalTable dataBoard={dataBoard} api={api} handleAnnulledForm={handleAnnulledForm} />
        </div>
        {/* Cancel Form Modal */}
        {showCancelForm && (
          <div className={styles.form_container}>
            <div className={styles.form_modal_bg}></div>
            <CancelInvoiceForm setCancelShowForm={setCancelShowForm} api={api} invoiceId={selectedInvoiceId} />
          </div>
        )}
      </div>
    </>
  )
}

export default Historical