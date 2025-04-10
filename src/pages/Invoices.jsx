import { useState } from "react";
import SideMenu from "../components/SideMenu";
import styles from "../styles";
import { FaPlus } from "react-icons/fa";

import InvoicesTable from "../components/Invoices/InvoicesTable";
import { invoicesData } from "../constants";

const Invoices = () => {
  const [dataBoard, setDataBoard] = useState(invoicesData);

  return (
    <>
      <div className={styles.blank_page}>
        <div className="w-64">
          <SideMenu />
        </div>

        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Facturas</h2>
            <div className={styles.button_header_container}>
              <button className={styles.button_header}>
                <FaPlus /> Agregar Factura
              </button>
            </div>
          </div>
          <InvoicesTable dataBoard={dataBoard} invoiceStatus={1} />
          <InvoicesTable dataBoard={dataBoard} invoiceStatus={2} />
          <InvoicesTable dataBoard={dataBoard} invoiceStatus={3} />
          {/* TODO Invoice Table Map */}
          {/* <UsersTable
            api={api}
            dataBoard={dataBoard}
            handleOpenUserForm={handleOpenUserForm}
          /> */}
        </div>
      </div>
    </>
  );
};

export default Invoices;
