import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "../styles";
import Dashboard from "../pages/Dashboard";

import Navbar from "../components/Navbar";

function LandingLecture({ api }) {
    const { userId } = useParams();

    return (
        <>
            {/* <div className={styles.blank_page}>
                <Navbar />
                <div className={styles.page_container}>
                    Simple Landing Lecture
                    <p className="bg-green-600">{userId}</p>
                </div>
            </div> */}
            <Dashboard>
                <div className={styles.blank_page}>
                    <div className={styles.page_container}>
                        Simple Landing Lecture
                        <p className="bg-green-600">{userId}</p>
                    </div>
                </div>
            </Dashboard>
        </>
    )
}

export default LandingLecture