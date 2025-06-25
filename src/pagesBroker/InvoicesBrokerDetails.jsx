import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "../styles";

import Navbar from "../components/Navbar";

function InvoicesBrokerDetails() {
    const { userId, invoiceId } = useParams();

    return (
        <>
            <div className={styles.blank_page}>
                <Navbar />
                <div className={styles.page_container}>
                    Simple Detail Page Broker
                    <p>{userId}</p>
                    <p>{invoiceId}</p>
                </div>
            </div>
        </>

    )
}

export default InvoicesBrokerDetails