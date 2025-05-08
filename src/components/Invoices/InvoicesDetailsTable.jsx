import React, { useCallback, useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { SiGoogledocs } from "react-icons/si";
import LoadingScreen from "../LoadingScreen";
import { set } from 'date-fns';

const FormattedDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
};

function InvoicesDetailsTable({ api, userId, invoiceId }) {
    const [dataInvoice, setDataInvoice] = useState({}); // Estado para los datos de la factura
    const [clientSenderId, setClientSenderId] = useState(null);
    const [clientReceiverId, setClientReceiverId] = useState(null);
    const [dataClientSender, setDataClientSender] = useState({});
    const [dataClientReceiver, setDataClientReceiver] = useState({});
    const [loading, setLoading] = useState(true); // Estado de carga

    const [uploadedDocs, setUploadedDocs] = useState({});

    const getInvoiceData = useCallback(async () => {
        try {
            const response = await fetch(`${api}/invoices/byid/${invoiceId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": Cookies.get("token"),
                },
            });
            if (!response.ok) throw new Error("Error en la petición");
            const data = await response.json();
            setDataInvoice(data.results[0]);
            setClientSenderId(data.results[0].client_sender_id);
            setClientReceiverId(data.results[0].client_receiver_id);
        } catch (error) {
            console.error("Error al obtener los datos de la factura:", error);
        }
    }, [api, invoiceId]);

    const getClientSenderData = useCallback(async () => {
        if (!clientSenderId) return;
        try {
            const res = await fetch(`${api}/clients/byclientanduser/${clientSenderId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": Cookies.get("token"),
                },
            });
            if (!res.ok) throw new Error("Error en la petición del cliente emisor");
            const data = await res.json();
            setDataClientSender(data.results);
        } catch (error) {
            console.error("Error al obtener el cliente emisor:", error);
        }
    }, [api, clientSenderId]);

    const getClientReceiverData = useCallback(async () => {
        if (!clientReceiverId) return;
        try {
            const res = await fetch(`${api}/clients/byclientanduser/${clientReceiverId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": Cookies.get("token"),
                },
            });
            if (!res.ok) throw new Error("Error en la petición del cliente receptor");
            const data = await res.json();
            setDataClientReceiver(data.results);
        } catch (error) {
            console.error("Error al obtener el cliente receptor:", error);
        }
    }, [api, clientReceiverId]);

    const fetchUploadedDocs = useCallback(async () => {
        try {
            const res = await fetch(`${api}/invoices/user/docs/${invoiceId}`, {
                headers: {
                    "x-access-token": Cookies.get("token"),
                },
            });
            if (!res.ok) throw new Error("Error al obtener documentos");
            const data = await res.json();
            setUploadedDocs(data);
        } catch (error) {
            console.error("Error al obtener documentos:", error);
        }
    }, [api, invoiceId]);


    useEffect(() => {
        setLoading(true); // Carga inicial
        const fetchAllData = async () => {
            await getInvoiceData();
            await getClientSenderData();
            await getClientReceiverData();
            await fetchUploadedDocs();
        };

        if (invoiceId) fetchAllData();
        setLoading(false); // Carga inicial
    }, [getInvoiceData, getClientSenderData, getClientReceiverData, fetchUploadedDocs, invoiceId,]);




    const DiccHead = {
        name_rs: "Razón Social",
        rfc: "RFC",
        curp: "CURP",
        address: "Dirección",
        // zip_code: "Código Postal",
        // phone: "Teléfono",
        // email: "Correo Electrónico",
        bank_account: "No. Cuenta Bancaria",
        // created_at: "Fecha de creación",
        user_name: "Usuario Asignado",
    };
    const Dicc2Head = {
        name_rs: "Razón Social",
        rfc: "RFC",
        curp: "CURP",
        address: "Dirección",
        // zip_code: "Código Postal",
        // phone: "Teléfono",
        // email: "Correo Electrónico",
        bank_account: "No. Cuenta Bancaria",
        // created_at: "Fecha de creación",
        // user_name: "Usuario Asignado",
    };
    const Dicc3Head = {
        pipeline_id: "ID",
        type_pipeline: "Tipo",
        concept: "Concepto",
        subtotal: "Subtotal",
        iva: "IVA",
        total_amount: "Total",
        comision_percentage: "Porcentaje de Comisión",
        comision: "Cantidad de Comisión",
        total_refund: "Total Devolución",
        payment_type: "Tipo de pago",
        status: "Estatus",
        created_at: "Fecha de creación",
    };

    // const client = { ...data, created_at: FormattedDate(data.created_at) }; // Simulación de datos de la API

    // console.log(client); //Quitarlo
    // const [item, setItem] = useState(client); // Estado para los datos

    // Divide las claves en dos mitades
    const keys = Object.keys(DiccHead); // Orden de los campos
    const half = Math.ceil(keys.length / 2);
    const leftKeys = keys // Primera mitad de las claves
    const rightKeys = Object.keys(Dicc2Head); //(keys)
    const facturaKeys = Object.keys(Dicc3Head); //(keys)

    // Lista de los 4 tipos de documentos
    const documentTypes = ["PreXML", "FacXML", "PrePDF", "FacPDF"];

    const handleDocInvoiceUpload = async (e, docType) => {
        setLoading(true);
        const file = e.target.files[0];
        if (!file) return;

        //console.log(`Archivo ${docType}:`, file);
        const formData = new FormData();
        formData.append("document_type", docType);
        formData.append("invoice_id", invoiceId);
        formData.append("DocInvoice", file);

        try {
            const res = await fetch(`${api}/invoices/user/docs/${invoiceId}`, {
                method: "POST",
                headers: {
                    "x-access-token": Cookies.get("token"),
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Error al subir archivo");

            const result = await res.json();
            alert(`Archivo ${docType} subido correctamente`);
            // Opcional: refrescar datos
        } catch (err) {
            console.error(err);
            alert(`Error al subir archivo ${docType}`);
        }finally{
            setLoading(false);
            window.location.reload()
        }
    };

    const handleFinished = async () => {
        setLoading(true); // Carga inicial
        try {
            const res = await fetch(`${api}/invoices/user/finished/${invoiceId}`, {
                method: "PATCH",
                headers: {
                    "x-access-token": Cookies.get("token"),
                },
            });

            if (!res.ok) throw new Error("Error al subir archivo");

            const result = await res.json();
            alert(`subido correctamente`);
            // Opcional: refrescar datos
        } catch (err) {
            console.error(err);
            alert(`Error al terminar`);
        }
        setLoading(false); // Carga finalizada
    }

    const isAllDocsUploaded = documentTypes.every((docType) => uploadedDocs[docType]);

    if (loading) {
        return <LoadingScreen message="Cargando..." />; // Pantalla de carga
    }

    return (
        <>
            {/* <div>InvoicesUserDetails {userId}/{invoiceId}</div> */}
            <div className="flex flex-col lg:flex-row justify-between gap-6 p-4">
                {/* Tabla izquierda */}
                <div className="w-full lg:w-1/2 overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-4">Datos Emisor</h2>
                    <table className="w-full border border-gray-300 rounded-lg shadow min-w-[300px]" /*table-fixed*/>
                        <tbody>
                            {leftKeys.map((key) => (
                                <tr key={key} className="border-b">
                                    <th className="text-left p-2 bg-gray-300 font-medium whitespace-nowrap w-1/3">
                                        {DiccHead[key]}
                                    </th>
                                    <td className="p-2 max-w-[200px] break-words">
                                        {dataClientSender[key] ?? "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Tabla Izquierda Inferior */}
                    <div className="w-full  overflow-x-auto my-4">
                        <h2 className="text-lg font-semibold mb-4">Datos Receptor</h2>
                        <table className="w-full border border-gray-300 rounded-lg shadow min-w-[300px]" /*table-fixed*/>
                            <tbody>
                                {rightKeys.map((key) => (
                                    <tr key={key} className="border-b">
                                        <th className="text-left p-2 bg-gray-300 font-medium whitespace-nowrap w-1/3">
                                            {Dicc2Head[key]}
                                        </th>
                                        <td className="p-2 max-w-[200px] break-words">
                                            {dataClientReceiver[key] ?? "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 overflow-x-auto ">
                    <h2 className="text-lg font-semibold mb-4">Datos de la factura</h2>
                    <table className="w-full border border-gray-300 rounded-lg shadow min-w-[300px]" /*table-fixed*/>
                        <tbody>
                            {facturaKeys.map((key) => (
                                <tr key={key} className="border-b">
                                    <th className="text-left p-2 bg-gray-300 font-medium whitespace-nowrap w-1/3">
                                        {Dicc3Head[key]}
                                    </th>
                                    <td className="p-2 max-w-[200px] break-words">
                                        {dataInvoice[key] ?? "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Botón de Terminado */}
            {isAllDocsUploaded && userId > 0 && (
                <div className="flex justify-center">
                    <button
                        className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow"
                        onClick={handleFinished}
                    >
                        Terminado
                    </button>
                </div>
            )}


            {/* Todos los Documentos */}
            <section className="bg-blue-500 rounded-lg mt-8 py-10 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {documentTypes.map((index) => (
                    <article
                        key={index}
                        className="flex flex-col items-center justify-center w-full h-54 bg-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                    >
                        <header className="flex flex-col items-center">
                            <SiGoogledocs className="w-16 h-16 my-2" />
                            <h3 className="text-center font-medium">Archivo {index}</h3>
                            <p className="text-sm text-gray-600">(Subir Archivo PDF o XML)</p>
                        </header>

                        <footer className="flex flex-col items-center mt-4">
                            {uploadedDocs[index] ? (
                                <a className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                                    href={uploadedDocs[index]}>
                                    Ver archivo
                                </a>
                            ) : (
                                userId >= 0 && (<>
                                    <label
                                        htmlFor={`upload-file-${index}`}
                                        className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                                    >
                                        Seleccionar archivo
                                    </label>
                                    <input
                                        id={`upload-file-${index}`}
                                        type="file"
                                        hidden
                                        accept=".pdf,.xml"
                                        onChange={(e) => handleDocInvoiceUpload(e, index)}
                                    />
                                </>)
                            )}
                        </footer>
                    </article>
                ))}
            </section>
        </>
    )
}

export default InvoicesDetailsTable