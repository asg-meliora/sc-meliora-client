import React, { useState } from 'react';
import styles from "../../styles";


import { SiGoogledocs } from "react-icons/si";

const DiccDocs = {
    PreXML: "Prefactura XML",
    FacXML: "Factura XML",
    PrePDF: "Prefactura PDF",
    FacPDF: "Factura PDF",
};

function InvoicesDetailsDocs({ adminStatus = 0, uploadedDocs, handleDocInvoiceUpload, handleFinished, hasVisited, setError }) {

    // Lista de los 4 tipos de documentos
    const documentTypes = ["PreXML", "PrePDF", "FacXML", "FacPDF"];
    const isAllDocsUploaded = uploadedDocs
        ? documentTypes.every((docType) => uploadedDocs[docType])
        : false;

    const handleChange = (e, doctype) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const maxSize = 2 * 1024 * 1024; // 2MB

        const type = doctype.includes("XML") ? "XML" : "PDF";
        if (type === "XML") {
            if (!file.name.endsWith(".xml")) {
                setError("El archivo debe tener extensión .xml");
                e.target.value = ""; // Limpiar si falla la validación
                return false;
            }
        } else if (type === "PDF") {
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
        handleDocInvoiceUpload(file, doctype);
    }

    return (
        <>
            {/* Botón de Terminado */}
            {isAllDocsUploaded && adminStatus === 0 && hasVisited === 'En proceso' && (
                <div className="flex justify-center">
                    <button
                        className="px-5 py-3 mt-[-20px] mb-[25px] rounded-xl confirmButton text-white text-xl font-medium font-inter shadow-md shadow-green-800/50 hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
                        onClick={handleFinished}
                    >
                        Finalizar Proceso
                    </button>
                </div>
            )}

            {/* Todos los Documentos */}
            <section className="w-[95%] mx-auto py-10 px-5 grid grid-cols-1 md:grid-cols-2 gap-8 mt-[-15px]">
                {/* Sección Prefactura */}
                <div className="w-full mt-[-25px] px-6 py-4 bg-white shadow-sm border border-gray-200 rounded-lg">
                    <h2 className="text-3xl font-semibold font-inter text-gray-700 mb-2 text-center">
                        Prefactura
                    </h2>
                    <div className="flex flex-row gap-6 items-center">
                        {["PreXML", "PrePDF"].map((item) => (
                            <article
                                key={item}
                                style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                                className={styles.d_files_article}
                            >
                                <header className={styles.d_files_info_header}>
                                    <SiGoogledocs className={styles.d_files_info_icon} />
                                    <h3 className={styles.d_files_info_title}>
                                        Archivo {DiccDocs[item]}
                                    </h3>
                                    <p className={styles.d_files_info_date}>
                                        {adminStatus === 0
                                            ? `(Subir Archivo ${item.endsWith("XML") ? ".xml" : ".pdf"
                                            })`
                                            : "(Archivo Faltante)"}
                                    </p>
                                </header>
                                <hr className={styles.d_files_hr} />
                                <footer className={styles.d_files_buttons_container}>
                                    {uploadedDocs[item] ? (
                                        <a
                                            className="cursor-pointer downloadButton text-white px-3 py-1 rounded font-medium font-inter w-[50%] shadow-md shadow-blue-700/60 hover:scale-110 hover:font-semibold transition-all"
                                            href={uploadedDocs[item]}
                                        >
                                            Ver archivo
                                        </a>
                                    ) : (
                                        adminStatus === 0 && (
                                            <>
                                                <label
                                                    htmlFor={`upload-file-${item}`}
                                                    className="cursor-pointer updateButton text-white px-3 py-1 text-sm rounded font-medium font-inter w-[80%] shadow-md shadow-yellow-700/40 hover:scale-110 hover:font-semibold transition-all"
                                                >
                                                    Seleccionar archivo
                                                </label>
                                                <input
                                                    id={`upload-file-${item}`}
                                                    type="file"
                                                    hidden
                                                    accept={item.includes("XML") ? ".xml" : ".pdf"}
                                                    onChange={(e) => handleChange(e, item)}
                                                />
                                            </>
                                        )
                                    )}
                                </footer>
                                <div className="mb-4"></div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Sección Factura */}
                <div className="w-full mt-[-25px] px-6 py-4 bg-white shadow-sm border border-gray-200 rounded-lg">
                    <h2 className="text-3xl font-semibold font-inter text-gray-700 mb-2 text-center">
                        Factura
                    </h2>
                    <div className="flex flex-row gap-6 items-center">
                        {["FacXML", "FacPDF"].map((item) => (
                            <article
                                key={item}
                                style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                                className={styles.d_files_article}
                            >
                                <header className={styles.d_files_info_header}>
                                    <SiGoogledocs className={styles.d_files_info_icon} />
                                    <h3 className={styles.d_files_info_title}>
                                        Archivo {DiccDocs[item]}
                                    </h3>
                                    <p className={styles.d_files_info_date}>
                                        {adminStatus === 0
                                            ? `(Subir Archivo ${item.endsWith("XML") ? ".xml" : ".pdf"})`
                                            : "(Archivo Faltante)"}
                                    </p>
                                </header>
                                <hr className={styles.d_files_hr} />
                                <footer className={styles.d_files_buttons_container}>
                                    {uploadedDocs[item] ? (
                                        <a
                                            className="cursor-pointer downloadButton text-white px-3 py-1 rounded font-medium font-inter w-[50%] shadow-md shadow-blue-700/60 hover:scale-110 hover:font-semibold transition-all"
                                            href={uploadedDocs[item]}
                                        >
                                            Ver archivo
                                        </a>
                                    ) : (
                                        adminStatus === 0 && (
                                            <>
                                                <label
                                                    htmlFor={`upload-file-${item}`}
                                                    className="cursor-pointer updateButton text-white px-3 py-1 text-sm rounded font-medium font-inter w-[80%] shadow-md shadow-yellow-700/40 hover:scale-110 hover:font-semibold transition-all"
                                                >
                                                    Seleccionar archivo
                                                </label>
                                                <input
                                                    id={`upload-file-${item}`}
                                                    type="file"
                                                    hidden
                                                    accept={item.includes("XML") ? ".xml" : ".pdf"}
                                                    onChange={(e) => handleChange(e, item)}
                                                />
                                            </>
                                        )
                                    )}
                                </footer>
                                <div className="mb-4"></div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default InvoicesDetailsDocs