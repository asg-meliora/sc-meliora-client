import { useCallback, useEffect, useState } from "react";
import styles from "../../styles";
import Cookies from "js-cookie";

const CreateInvoiceForm = ({
  api,
  setCreateShowForm,
  serverErrorMessage = null,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    invoice_type: "",
    invoice_user: "",
    invoice_concept: "",
    invoice_subtotal: "",
    invoice_iva: "",
    invoice_client: "",
  });

  const [users, setUsers] = useState({ results: [] });
  const [clients, setClients] = useState({ results: [] });

  /**
   * Function that fetches the list of users from the server and updates the user board state
   * @async
   * @function fetchUsers
   * @returns {Promise<void>} Promise that resolves when users are fetched correctly & its state changes
   * @throws {Error} Throws error if the request fails
   */
  const fetchUsers = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await fetch(`${api}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log("Error al obtener usuaros:", error);
    }
  }, [api]);

  /**
   * Function that fetches the list of clients from the server and updates the clients board state
   * @async
   * @function fetchUsers
   * @returns {Promise<void>} Promise that resolves when clients are fetched correctly & its state changes
   * @throws {Error} Throws error if the request fails
   */
  const fetchClients = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await fetch(`${api}/clients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (!response.ok) throw new Error("Error al obtener clientes");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.log("Error al obtener usuaros:", error);
    }
  }, [api]);

  useEffect(() => {
    fetchUsers();
    fetchClients();
  }, [fetchUsers, fetchClients]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Validate Invoice Concept data
    setCreateShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <div className={styles.form_layout}>
        {/* Close Form Button */}
        <button
          onClick={() => setCreateShowForm(false)}
          className={styles.close_form_button}
        >
          ✕
        </button>

        {/* Form Title */}
        <h2 className={styles.form_heading}>Agregar Nueva Factura</h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Error Message */}
          {(errorMessage || serverErrorMessage) && (
            <div className={styles.error_message}>
              {errorMessage ? errorMessage : serverErrorMessage}
            </div>
          )}

          {/* Invoice Type Select */}
          <select
            name="invoice_type"
            value={formData.invoice_type || ""}
            onChange={handleChange}
            className={`${styles.select_form} ${
              formData.invoice_type
                ? "text-black font-normal"
                : "italic text-gray-500"
            }`}
          >
            <option value="" hidden disabled>
              Tipo de Factura
            </option>
            <option value="I">Ingreso</option>
            <option value="E">Egreso</option>
            <option value="T">Traslado</option>
            <option value="N">Nómina</option>
            <option value="P">Pago</option>
          </select>

          {/* Users Select */}
          <select
            name="invoice_user"
            value={formData.invoice_user || ""}
            onChange={handleChange}
            className={`${styles.select_form} ${
              formData.invoice_user
                ? "text-black font-normal"
                : "italic text-gray-500"
            }`}
          >
            <option value="" hidden disabled>
              Usuario Asignado
            </option>
            {users.results.map((user) => (
              <option key={user.id} value={user.id}>
                {user.user_name}
              </option>
            ))}
          </select>

          {/* Invoice Concept */}
          <input
            type="text"
            name="invoice_concept"
            placeholder="Concepto de Factura"
            value={formData.invoice_concept || ""}
            onChange={handleChange}
            className={styles.input_form}
          />

          {/* Invoice Subtotal */}
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              name="invoice_subtotal"
              placeholder="Subtotal"
              step={0.01}
              min={0}
              value={formData.invoice_subtotal || ""}
              onChange={handleChange}
              className={`${styles.input_form} pr-16`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
              $MXN
            </span>
          </div>
          
          {/* Invoice Iva */}
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              name="invoice_iva"
              placeholder="Iva"
              step={0.01}
              min={0}
              value={formData.invoice_iva || ""}
              onChange={handleChange}
              className={`${styles.input_form} pr-16`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
              $MXN
            </span>
          </div>

          {/* Invoice Company Name Select */}
          <select
            name="invoice_client"
            value={formData.invoice_client || ""}
            onChange={handleChange}
            className={`${styles.select_form} ${
              formData.invoice_client
                ? "text-black font-normal"
                : "italic text-gray-500"
            }`}
          >
            <option value="" hidden disabled>
              Razon Social
            </option>
            {clients.results.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name_rs}
              </option>
            ))}
          </select>

          {/* Add Invoice Button */}
          <button type="submit" className={styles.send_button}>
            Agregar Factura
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateInvoiceForm;
