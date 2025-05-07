import React from 'react'
import { useParams } from "react-router-dom";

import styles from "../../styles";
import SideMenu from "../../components/SideMenu";

import InvoicesDetailsTable from '../../components/Invoices/InvoicesDetailsTable';

function InvoicesDetails({ api }) {
    const { id } = useParams();
    return (
        <div className={styles.blank_page}>
            <div className="w-64">
                <SideMenu />
            </div>
            <div className={styles.page_container}>
                <div className={styles.header_container}>
                    <h2 className={styles.heading_page}>Facturas</h2>
                </div>
                <InvoicesDetailsTable api={api} userId={-1} invoiceId={id} />
            </div>
        </div>
    )
}

export default InvoicesDetails