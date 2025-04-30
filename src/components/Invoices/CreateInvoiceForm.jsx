import React, { useCallback, useEffect, useState } from "react";
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
    invoice_concept: "",
    invoice_total: "",
    invoice_subtotal: "",
    invoice_iva: "",
    invoice_comision_percentage: "",
    invoice_payment_type: "",
    invoice_client_sender: "",      // <--- Nuevo campo
    invoice_client_receiver: "",    // <--- Nuevo campo
  });

  const [users, setUsers] = useState({ results: [] });
  const [clients, setClients] = useState({ results: [] });
  const [RFC, setRFC] = useState(null);

  /**
   * Function that fetches the list of users from the server and updates the user board state
   * @async
   * @function fetchUsers
   * @returns {Promise<void>} Promise that resolves when users are fetched correctly & its state changes
   * @throws {Error} Throws error if the request fails
   */
  const fetchUsers = useCallback(async (client_id) => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado. Por favor, inicia sesión.");
      return;
    }
    try {
      const response = await fetch(`${api}/usersclients/byid/${client_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsers(data.results[0]);

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
      console.log("Clientes:", data); //QUITARLO
    } catch (error) {
      console.log("Error al obtener usuaros:", error);
    }
  }, [api]);

  useEffect(() => {
    //fetchUsers();
    fetchClients();
  }, [/*fetchUsers,*/ fetchClients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData); //QUITARLO
    

    // Aquí puedes hacer la lógica para enviar los datos al servidor
    try {
      const response = await fetch(`${api}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error al crear la factura");
      const data = await response.json();
      alert("Factura creada correctamente");
    } catch (error) {
      console.error("Error al crear la factura:", error);
    }


    // TODO: Validate Invoice Concept data
    setCreateShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value,
      // Si seleccionas en uno, y el otro tenía ese valor, lo limpia
      // ...(name === "invoice_client_sender" && prev.invoice_client_receiver === value
      //   .? { invoice_client_receiver: "" }
      //   : {}),
      // ...(name === "invoice_client_receiver" && prev.invoice_client_sender === value
      //   .? { invoice_client_sender: "" }
      //   : {}),
    }));
    if (name === "invoice_client_sender") {
      setUsers({ results: [] });  // Limpia antes de la petición
      fetchUsers(value);
    }
    if (name === "invoice_client_receiver") {

      const clienteSeleccionado = clients.results.find( // Obtenemos el cliente seleccionado y le sacamos el RFC
        c => String(c.client_id) === String(value)
      );
      // Extraer el RFC, si existe
      const rfc = clienteSeleccionado?.rfc || "";
      setRFC(rfc);
    }
    if (name === "invoice_total") {
      // Si no hay valor, limpia
      if (!value) {
        setFormData((prev) => ({
          ...prev,
          invoice_total: "",
          invoice_subtotal: "",
          invoice_iva: ""
        }));
        return;
      }

      const total = parseFloat(value);
      if (isNaN(total)) return;

      const subtotal = total / 1.16;
      const iva = subtotal * 0.16;

      setFormData((prev) => ({
        ...prev,
        invoice_total: value,
        invoice_subtotal: subtotal.toFixed(2),
        invoice_iva: iva.toFixed(2)
      }));
      return; // no seguir con el resto de handleChange para este campo
    }
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

        <form onSubmit={handleSubmit} className={styles.form} /*noValidate*/>
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
            required
            className={`${styles.select_form} ${formData.invoice_type
              ? "text-black font-normal"
              : "italic text-gray-500"
              }`}
          >
            <option value="" hidden disabled>
              Tipo de Factura
            </option>
            <option value="PUE">PUE</option>
            <option value="PPD">PPD</option>
          </select>
          {/* Invoice Concept */}
          <input
            type="text"
            name="invoice_concept"
            placeholder="Concepto de Factura"
            value={formData.invoice_concept || ""}
            onChange={handleChange}
            required
            className={styles.input_form}
          />
          {/* Invoice Payment Type */}
          <select
            name="invoice_payment_type"
            value={formData.invoice_payment_type || ""}
            onChange={handleChange}
            required
            className={`${styles.select_form} ${formData.invoice_payment_type
              ? "text-black font-normal"
              : "italic text-gray-500"
              }`}
          >
            <option value="" hidden disabled>
              Tipo de Pago
            </option>
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
            <option value="Traslado">Traslado</option>
            <option value="Nómina">Nómina</option>
            <option value="Pago">Pago</option>

          </select>


          {/* Invoice Total */}
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              name="invoice_total"
              placeholder="Total"
              step={0.01}
              min={0}
              value={formData.invoice_total || ""}
              onChange={handleChange}
              required
              className={`${styles.input_form} pr-16`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
              $MXN
            </span>
          </div>
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
              required
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
              required
              className={`${styles.input_form} pr-16`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
              $MXN
            </span>
          </div>


          {/* Invoice Comision */}
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              name="invoice_comision_percentage"
              placeholder="Comision %"
              step={0.01}
              min={0}
              value={formData.invoice_comision_percentage || ""}
              onChange={handleChange}
              required
              className={`${styles.input_form} pr-16`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
              %
            </span>
          </div>


          {/* Select de Razón Social Primario */}
          <select
            name="invoice_client_sender"
            value={formData.invoice_client_sender || ""}
            onChange={handleChange}
            required
            className={`${styles.select_form} ${formData.invoice_client_sender
              ? "text-black font-normal"
              : "italic text-gray-500"
              }`}
          >
            <option value="" hidden disabled>
              Razón Social (Emisor)
            </option>
            {clients.results
              .filter((client) => String(client.client_id) !== String(formData.invoice_client_receiver))
              .map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.name_rs}
                </option>
              ))}
          </select>
          {/* Usuario asignado */}
          <div className={`${styles.input_form} pr-16`}>
            {users.user_name
              ? <span className="text-gray-800">{users.user_name}</span>
              : <span className="text-gray-400 italic">Usuario asignado del emisor</span>
            }
          </div>


          {/* Select de Razón Social Secundario */}
          <select
            name="invoice_client_receiver"
            value={formData.invoice_client_receiver || ""}
            onChange={handleChange}
            required
            className={`${styles.select_form} ${formData.invoice_client_receiver
              ? "text-black font-normal"
              : "italic text-gray-500"
              }`}
          >
            <option value="" hidden disabled>
              Razón Social (Receptor)
            </option>
            {clients.results
              .filter((client) => String(client.client_id) !== String(formData.invoice_client_sender))
              .map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.name_rs}
                </option>
              ))}
          </select>
          {/* RFC asignado */}
          <div className={`${styles.input_form} pr-16`}>
            {RFC
              ? <span className="text-gray-800">{RFC}</span>
              : <span className="text-gray-400 italic">RFC del Receptor</span>
            }
          </div>
          {/* CSF asignado */}
          <div className={`${styles.input_form} pr-16`}>
            {RFC
              ? <span className="text-gray-800">CSF-{RFC}.PDF</span>
              : <span className="text-gray-400 italic">CSF del Receptor</span>
            }
          </div>


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
