import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import Navbar from "../components/Navbar";

function LandingLecture({ api }) {
    const { userId } = useParams();

    return (
        <div>
            {/* <Navbar /> */}
            Simple Landing Lecture
            <p className="bg-green-600">{userId}</p>
        </div>
    )
}

export default LandingLecture