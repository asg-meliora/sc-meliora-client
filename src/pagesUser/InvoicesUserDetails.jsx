import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const FormattedDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;

    return formattedDate;
};

function InvoicesUserDetails({ api }) {

    const { userId, invoiceId } = useParams();

    const DiccHead = {
        name_rs: "Razón Social",
        rfc: "RFC",
        curp: "CURP",
        address: "Dirección",
        zip_code: "Código Postal",
        phone: "Teléfono",
        email: "Correo Electrónico",
        bank_account: "No. Cuenta Bancaria",
        created_at: "Fecha de creación",
        user_name: "Usuario Asignado",
        H: "H",
        G: "G",
    };

    const data = {
        name_rs: "exampleRS5",
        rfc: "GFC435",
        curp: "LPKI2RTY5",
        address: "calle5",
        zip_code: "904504",
        phone: "7771232334",
        email: "H",
        bank_account: "0129301923",
        created_at: "2025-03-25T00:57:41.000Z",
        user_name: "exampleUser",
    };

    //TODO: cambiar a useCallback y cambiar el uso de localStorage por otra forma de guardar el progreso
    useEffect(() => {
        const sendProcess = async () => {
            const key = `hasVisited_${invoiceId}`;
            const hasVisited = localStorage.getItem(key);

            if (!hasVisited) {
                localStorage.setItem(key, 'true');

                try {
                    const response = await fetch(`${api}/invoices/user/process/${invoiceId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': Cookies.get("token"),
                        },
                    });
                    if (!response.ok) throw new Error("Error en la petición");

                    const data = await response.json();
                    console.log('Progreso enviado al backend:', data); // Quitalo

                } catch (error) {
                    console.error('Error al enviar la información al backend:', error);
                }
            }
        };

        sendProcess();
    }, [api, invoiceId]);


    const invoices = { ...data, created_at: FormattedDate(data.created_at) }; // Simulación de datos de la API

    console.log(invoices); //Quitarlo
    const [item, setItem] = useState(invoices); // Estado para los datos

    // Divide las claves en dos mitades
    const keys = Object.keys(DiccHead); // Orden de los campos
    const half = Math.ceil(keys.length / 2);
    const leftKeys = keys.slice(0, half); // Primera mitad de las claves
    const rightKeys = keys.slice(half);


    return (
        <>
            <div>InvoicesUserDetails {userId}/{invoiceId}</div>
            <div className="flex flex-col lg:flex-row justify-between gap-6 p-4">
                {/* Tabla izquierda */}
                <div className="w-full lg:w-1/2 overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-4">Datos Emisor</h2>
                    <table
                        className="w-full border border-gray-300 rounded-lg shadow min-w-[300px]" /*table-fixed*/
                    >
                        <tbody>
                            {leftKeys.map((key) => (
                                <tr key={key} className="border-b">
                                    <th className="text-left p-2 bg-gray-300 font-medium whitespace-nowrap w-1/3">
                                        {DiccHead[key]}
                                    </th>
                                    <td className="p-2 max-w-[200px] break-words">
                                        {item[key] ?? "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tabla derecha */}
                <div className="w-full lg:w-1/2 overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-4">Datos Receptor</h2>
                    <table className="w-full border border-gray-300 rounded-lg shadow table-fixed min-w-[300px]">
                        <tbody>
                            {rightKeys.map((key) => (
                                <tr key={key} className="border-b">
                                    <th className="text-left p-2 bg-gray-300 font-medium whitespace-nowrap">
                                        {DiccHead[key]}
                                    </th>
                                    <td className="p-2 max-w-[200px] break-words">
                                        {item[key] ?? "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
}

export default InvoicesUserDetails