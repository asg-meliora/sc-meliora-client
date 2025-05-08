import React, { useState } from 'react';
import styles from "../../styles";
import Cookies from 'js-cookie';

import LoadingScreen from "../LoadingScreen";


const CancelInvoiceForm = ({ setCancelShowForm, serverErrorMessage = null, api, invoiceId }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({ invoice_file: null });
  const [loading, setLoading] = useState(false); // Estado de carga

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (!formData.invoice_file) {
      setErrorMessage("Debes subir un archivo para cancelar la factura.");
      return;
    }
    const sendFile = new FormData();
    sendFile.append("document_type", "Cancelada");
    sendFile.append("invoice_id", invoiceId);
    sendFile.append("DocInvoice", formData.invoice_file);
    try {
      const response = await fetch(`${api}/historical/canceled/${invoiceId}`, {
        method: "POST",
        headers: {
          "x-access-token": Cookies.get("token"), // No pongas 'Content-Type' con FormData
        },
        body: sendFile,
      });

      if (!response.ok) throw new Error("Error al subir el archivo");
      // manejar éxito...

    } catch (err) {
      setErrorMessage(err.message);
    }
    finally {
      setLoading(false);
      alert('Exitosamente exitoso');
      setCancelShowForm(false);
      window.location.reload()
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, invoice_file: file, }));
  };

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
        <h2 className={styles.form_heading}>Cancelar Factura</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>

          {/* Error Message */}
          {(errorMessage || serverErrorMessage) && (
            <div className={styles.error_message}>
              {errorMessage ? errorMessage : serverErrorMessage}
            </div>
          )}

          {/* Cancelation File */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="invoice_file"
              className="text-base font-semibold text-gray-700"
            >
              <p>Si desea cancelar la factura, por favor </p>
              <span className="text-red-500">*</span>
              Adjuntar archivo de cancelación


            </label>
            <input
              type="file"
              name="invoice_file"
              accept=".pdf,.xml" // puedes personalizar según el tipo de archivo permitido
              onChange={handleChange}
              className={styles.input_file}
            />
          </div>
          {formData.invoice_file && (
            <p className="text-sm text-gray-700">
              Archivo seleccionado: {formData.invoice_file.name}
            </p>
          )}
          {/* Confirm Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition duration-200"
            >
              Confirmar Cancelación
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CancelInvoiceForm;
