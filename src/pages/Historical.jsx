import React, { useCallback, useEffect, useState } from 'react';
import SideMenu from '../components/SideMenu'
import styles from '../styles';
import Cookies from 'js-cookie';
import LoadingScreen from "../components/LoadingScreen";

import HistoricalTable from '../components/Historical/HistoricalTable';
import Navbar from '../components/Navbar';
import CancelInvoiceForm from '../components/Historical/CancelInvoiceForm';

const Historical = ({ api }) => {
  const [dataBoard, setDataBoard] = useState([]); // Estado para almacenar los datos de la tabla
  const [loading, setLoading] = useState(true); // Estado de carga
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [showCancelForm, setCancelShowForm] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const getHistorical = useCallback(async () => {
    setLoading(true); // Carga inicial
    try {
      const response = await fetch(`${api}/historical/finalized?page=${currentPage}&limit=${5}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });
      //Error handling
      if (!response.ok) throw new Error("Error en la petición");

      const data = await response.json();
      setDataBoard(data.results);               //Datos
      setTotalPages(data.pagination.totalPages); //Total de Paginas
    } catch (err) {
      console.log(err);
      //setError(err.message);
    } finally {
      setLoading(false); // Carga finalizada
    }
  }, [api, currentPage]);

  const fetchSearch = useCallback(async (searchChar) => {
    setLoading(true); // Carga inicial
    try {
      const response = await fetch(`${api}/historical/search?q=${encodeURIComponent(searchChar)}&page=${currentPage}&limit=${10}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });
      //Error handling
      if (!response.ok) throw new Error("Error en la petición");

      const data = await response.json();
      setDataBoard(data.results);               //Datos
      //setTotalPages(data.pagination.totalPages); //Total de Paginas
    } catch (err) {
      console.log(err);
      //setError(err.message);
    } finally {
      setLoading(false); // Carga finalizada
    }
  }, [api, currentPage]);

  useEffect(() => {
    getHistorical();
  }, [getHistorical]);

  const handleAnnulledForm = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setCancelShowForm(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <LoadingScreen message="Cargando..." />; // Pantalla de carga
  }

  console.log('Data', dataBoard)

  return (
    <>
      <div className={styles.blank_page}>
        <Navbar />

        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Histórico</h2>
          </div>
          {/* Tabla Historical */}
          <HistoricalTable dataBoard={dataBoard} api={api} handleAnnulledForm={handleAnnulledForm} getSearch={fetchSearch} />

          {/* Paginación */}
          <div className="flex justify-center items-center space-x-4">
            <button className="rounded-lg bg-yellow-600 px-4 py-2 text-white font-semibold hover:bg-yellow-700 transition duration-200" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button className="rounded-lg bg-yellow-600 px-4 py-2 text-white font-semibold hover:bg-yellow-700 transition duration-200" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
              Siguiente
            </button>
          </div>
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