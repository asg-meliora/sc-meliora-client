import React from 'react'
import { SiGoogledocs } from 'react-icons/si'

import styles from "../../styles";

function CancelledInvoiceDoc({ adminStatus = 0, uploadedDocs, setError, handleCancelledInvoiceDoc }) {

    const handleChange = (e, doctype) => {
        const file = e.target.files?.[0];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!file) {
            setError("Debes subir un archivo para cancelar la factura.");
            return;
        }

        const type = doctype.includes("XML") ? "XML" : "PDF";
        // if (type === "XML") {
        //     if (!file.name.endsWith(".xml")) {
        //         setError("El archivo debe tener extensión .xml");
        //         e.target.value = ""; // Limpiar si falla la validación
        //         return false;
        //     }
        if (type === "PDF") {
            if (!file.name.endsWith(".pdf")) {
                setError("El archivo debe tener extensión .pdf");
                e.target.value = ""; // Limpiar si falla la validación
                return false;
            }
        } else {
            setError("Tipo de documento no válido");
            e.target.value = ""; // Limpiar si falla la validación
            return false;
        }

        if (file.size > maxSize) {
            setError("El archivo debe ser menor a 2MB.");
            e.target.value = ""; // Limpiar si falla la validación
            return false;
        }
        console.log(file);
        handleCancelledInvoiceDoc(file, doctype);
    }

    return (
        <section className="w-[95%] mx-auto py-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-8 mt-[-15px]">
            <div className="w-full mt-[-25px] px-6 py-4 bg-white shadow-sm border border-gray-200 rounded-lg">
                <h2 className="text-3xl font-semibold font-inter text-gray-700 mb-2 text-center">
                    Cancelación de Factura
                </h2>
                <div className="flex flex-row gap-6 justify-center">
                    <article
                        style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                        className={styles.d_files_article}
                    >
                        <header className={styles.d_files_info_header}>
                            <SiGoogledocs className={styles.d_files_info_icon} />
                            <h3 className={styles.d_files_info_title}>
                                Archivo Cancelación PDF
                            </h3>
                            <p className={styles.d_files_info_date}>
                                {uploadedDocs['Cancelada']
                                    ? "(Archivo Subido)"
                                    : adminStatus === 0
                                        ? `(Subir Archivo .pdf)`
                                        : "(Archivo Faltante)"}
                            </p>
                        </header>
                        <hr className={styles.d_files_hr} />
                        <footer className={styles.d_files_buttons_container}>
                            {uploadedDocs['Cancelada'] ? (
                                <a
                                    className="cursor-pointer downloadButton text-white px-3 py-1 rounded font-medium font-inter w-[50%] shadow-md shadow-blue-700/60 hover:scale-110 hover:font-semibold transition-all"
                                    href={uploadedDocs['Cancelada']}
                                >
                                    Ver archivo
                                </a>
                            ) : (
                                adminStatus === 0 && (
                                    <>
                                        <label
                                            htmlFor={`upload-file-Cancelada`}
                                            className="cursor-pointer updateButton text-white px-3 py-1 text-sm rounded font-medium font-inter w-[80%] shadow-md shadow-yellow-700/40 hover:scale-110 hover:font-semibold transition-all"
                                        >
                                            Seleccionar archivo
                                        </label>
                                        <input
                                            id={`upload-file-Cancelada`}
                                            type="file"
                                            hidden
                                            accept=".pdf, application/pdf"
                                            onChange={(e) => handleChange(e, "Cancelada")}
                                        />
                                    </>
                                )
                            )}
                        </footer>
                        <div className="mb-4"></div>
                    </article>
                </div>
            </div>
        </section>
    )
}

export default CancelledInvoiceDoc