import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "../styles";
import Invoices from "../pages/Invoices";

import Navbar from "../components/Navbar";

function LandingBroker({ api }) {
    const { userId } = useParams();

    return (
        <>
            {/* <div className={styles.blank_page}>
                <Navbar />
                <div className={styles.page_container}>
                    Simple Landing Broker
                    <p>{userId}</p>
                </div>

            </div> */}
            <Invoices api={api} />
        </>

    )
}

export default LandingBroker