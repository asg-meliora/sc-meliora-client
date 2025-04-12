import styles from "../../styles";
import { useState } from "react";

const CancelInvoiceForm = ({
  setCancelShowForm,
  serverErrorMessage = null,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    invoice_file: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Validations
  };

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  return (
    <>
      <div className={styles.form_layout}>
        {/* Close Form Button */}
        <button
          onClick={() => setCancelShowForm(false)}
          className={styles.close_form_button}
        >
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
              Adjuntar archivo de cancelacion
            </label>
            <input
              type="file"
              name="invoice_file"
              accept=".pdf,.xml,.jpg,.png" // puedes personalizar según el tipo de archivo permitido
              onChange={handleChange}
              className={styles.input_file}
            />
          </div>
          {formData.invoice_file && (
            <p className="text-sm text-gray-700">
              Archivo seleccionado: {formData.invoice_file.name}
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default CancelInvoiceForm;
