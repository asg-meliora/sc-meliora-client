import React, { useState } from 'react';
import styles from "../../styles";
import Cookies from 'js-cookie';

import LoadingScreen from "../LoadingScreen";

const CancelInvoiceForm = ({ setCancelShowForm, setError, api, invoiceId, getHistorical, setSuccess }) => {
  const [formData, setFormData] = useState({ invoice_file: null });
  const [loading, setLoading] = useState(false); // Estado de carga

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await fetch(`${api}/historical/cancelling/${invoiceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });
      if (!response.ok) throw new Error("Error al Iniciar la cancelación de la factura");
      setSuccess("La solicitud de la factura ha iniciado correctamente"); // Manejar éxito
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
      setCancelShowForm(false);
      getHistorical();
    }
  };

  // const handleChange = (e) => {
  //   const file = e.target.files[0];
  //   const maxSizeMB = 2;
  //   const maxSizeBytes = maxSizeMB * 1024 * 1024; //Limite de tamaño de archivo 2MB

  //   if (!file) return;

  //   if (file) {
  //     const isPdf = file.type === "application/pdf";
  //     if (!isPdf) {
  //       setError("Solo se permiten archivos en formato PDF"); //Rechazar si no es pdf
  //       e.target.value = null; //Resetear cualquier archivo cargado local
  //     } else if (file.size > maxSizeBytes) {
  //       setError(`El archivo supera el límite de ${maxSizeMB}MB`); //Rechazar si pesa mucho
  //       e.target.value = null; //Resetear cualquier archivo cargado local
  //     } else {
  //       setFormData((prev) => ({ ...prev, invoice_file: file, })); //Subir Archivo
  //     }
  //   }
  // };

  if (loading) {
    return <LoadingScreen message="Cargando..." />; // Pantalla de carga
  }

  return (
    <>
      <div className={styles.form_layout}>
        {/* Close Form Button */}
        <button onClick={() => setCancelShowForm(false)} className={styles.close_form_button}>
          {" "}
          ✕
        </button>


        {/* Form Title */}
        <h2 className={`${styles.form_heading} text-center `}>
          Confirmar cancelación de factura
        </h2>

        <div className={`${styles.form} grid grid-cols-2 py-2`}>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl confirmButton text-white font-medium font-inter shadow-md shadow-green-800/50 hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
          >
            Confirmar
          </button>
          <button
            onClick={() => setCancelShowForm(false)}
            className="px-5 py-2 rounded-xl logoutButton text-white font-medium font-inter shadow-md shadow-red-800/50 hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>

    </>
  );
};

export default CancelInvoiceForm;


{/* <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center w-full max-w-xs">
  <SiGoogledocs className="text-6xl text-gray-800 mb-3" />
  <h3 className="text-lg font-semibold text-gray-800 text-center">
    Archivo
  </h3>
  <p className="text-sm italic text-gray-500 mb-4">(Archivo Subido)</p>
  <a
    
    target="_blank"
    rel="noopener noreferrer"
    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-all"
  >
    Ver archivo
  </a>
</div> */}