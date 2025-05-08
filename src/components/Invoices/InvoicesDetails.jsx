import React, { useState } from "react";
import { useParams } from "react-router-dom";

import styles from "../../styles";
import Navbar from "../../components/Navbar";

import { AnimatePresence } from "framer-motion";
import LoadingScreen from "../LoadingScreen";

import InvoicesDetailsTable from "../../components/Invoices/InvoicesDetailsTable";

function InvoicesDetails({ api }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  console.log("Loading ", loading);
  
  return (
    <>
    <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <div className={styles.blank_page}>
        <Navbar />
        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Facturas</h2>
          </div>
          <InvoicesDetailsTable
            api={api}
            userId={-1}
            invoiceId={id}
            setLoading={setLoading}
          />
        </div>
      </div>
    </>
  );
}

export default InvoicesDetails;
