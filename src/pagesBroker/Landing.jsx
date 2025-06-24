import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import Navbar from "../components/Navbar";

function Landing({ api }) {
    const { userId } = useParams();

    return (
        <div>
            {/* <Navbar /> */}
            Simple Landing
            <p>{userId}</p>
        </div>
    )
}

export default Landing