import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import "./FilesTable.css";

function FilesTable({ api, newFiles }) {
    // "client_id": 6,
    // "name_rs": "exampleRS5",
    // "rfc": "GFC435",
    // "curp": "LPKI2RTY5",
    // "address": "calle5",
    // "zip_code": "904504",
    // "phone": "7771232334",
    // "email": "exapmle2cliente@ex.com",
    // "bank_account": "0129301923"
    // "created_at": "2025-03-25T00:57:41.000Z"

    const FormattedDate = ({ dateString }) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

        return <div>{formattedDate}</div>;
    };

    //console.log('Debug Table',newFiles);
    return (
        <table className="cont min-w-full">
            <thead className="navbar">
                <tr>
                    <th className="px-4 py-2">Razón Social</th>
                    <th className="px-4 py-2">RFC</th>
                    <th className="px-4 py-2">CURP</th>
                    <th className="px-4 py-2">Dirección</th>
                    <th className="px-4 py-2">C.P.</th>
                    <th className="px-4 py-2">Teléfono</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Número de cuenta</th>
                    <th className="px-4 py-2">Fecha de creación</th>
                </tr>
            </thead>
            <tbody>
                {newFiles.results.map((results, index) => (
                    <tr className="navbar" key={results.client_id || results.insertId}>
                        <td className="px-4 py-2">{results.name_rs}</td>
                        <td className="px-4 py-2">{results.rfc}</td>
                        <td className="px-4 py-2">{results.curp}</td>
                        <td className="px-4 py-2">{results.address}</td>
                        <td className="px-4 py-2">{results.zip_code}</td>
                        <td className="px-4 py-2">{results.phone}</td>
                        <td className="px-4 py-2">{results.email}</td>
                        <td className="px-4 py-2">{results.bank_account}</td>
                        <td className="px-4 py-2"><FormattedDate dateString={results.created_at}/></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default FilesTable