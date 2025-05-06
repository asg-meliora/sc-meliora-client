import { useState } from "react";
import styles from "../styles";
import { FaPlus } from "react-icons/fa";

import InvoicesTable from "../components/Invoices/InvoicesTable";
import { invoicesData } from "../constants";

import CreateInvoiceForm from "../components/Invoices/CreateInvoiceForm";
import CancelInvoiceForm from "../components/Invoices/CancelInvoiceForm";
import Navbar from "../components/Navbar";

const Invoices = ({ api }) => {
  const [dataBoard, setDataBoard] = useState(invoicesData);
  const [showCreateForm, setCreateShowForm] = useState(false);
  const [showCancelForm, setCancelShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenCreateForm = () => {
    setCreateShowForm(true);
  };

  const handleOpenCancelForm = () => {
    setCancelShowForm(true);
  };

  return (
    <>
      <div className={styles.blank_page}>
        <Navbar />

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
          />
          <InvoicesTable dataBoard={dataBoard} invoiceStatus={2} />
          <InvoicesTable dataBoard={dataBoard} invoiceStatus={3} />
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
