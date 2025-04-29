import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie";

import styles from "../styles";
import SideMenu from "../components/SideMenu";

import InvoicesTable from "../components/Invoices/InvoicesTable";

function InvoicesUser({ api }) {
  const { id } = useParams();
  const [dataBoard, setDataBoard] = useState({ results: [] });
  const [loading, setLoading] = useState(false);
  
  const getPipelines = useCallback(async () => {
    setLoading(true); // Carga inicial

    try {
      const response = await fetch(`${api}/invoices/user/byid/${id}`, {
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

  return (
    <div>
      <div className={styles.blank_page}>
        <div className="w-64">
          <SideMenu />
        </div>

        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Facturas</h2>
          </div>
          <InvoicesTable
            dataBoard={dataBoard}
            invoiceStatus={1}
            userStatus={0}
          />
          <InvoicesTable dataBoard={dataBoard} invoiceStatus={2} />
          <InvoicesTable dataBoard={dataBoard} invoiceStatus={3} />
        </div>
      </div>

      <div>InvoicesUser {id}</div>
    </div>

  )
}

export default InvoicesUser