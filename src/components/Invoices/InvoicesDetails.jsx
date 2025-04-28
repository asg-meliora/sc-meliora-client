import React from 'react'
import { useParams } from "react-router-dom";

function InvoicesDetails({ api }) {
    const { id } = useParams();
    return (
        <div>InvoicesDetails {id}</div>
    )
}

export default InvoicesDetails