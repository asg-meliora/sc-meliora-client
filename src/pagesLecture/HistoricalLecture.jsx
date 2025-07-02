import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "../styles";
import Historical from "../pages/Historical";

import Navbar from "../components/Navbar";

function HistoricalLecture({ api }) {
    const { userId } = useParams();

    return (
        <>
            {/* <div className={styles.blank_page}>
                <Navbar />
                <div className={styles.page_container}>
                    Simple Landing Historical Lecture
                    <p>{userId}</p>
                </div>
            </div> */}
            <Historical api={api} />
        </>
    )
}

export default HistoricalLecture