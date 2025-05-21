import React, { useCallback, useEffect, useState } from "react";
import styles from "../../styles";
import Cookies from "js-cookie";
import { validateInvoiceFormData } from "../../validations";

import { SuccessTexts } from "../../constants/Texts";
import ErrorFormText from "../ErrorFormText";
import { AnimatePresence } from "framer-motion";

const InvoiceFormKeys = { //Solo para placeholders
  invoice_type: "Tipo de Factura",
  invoice_concept: "Concepto de Factura",
  invoice_payment_type: "Método de Pago",
  invoice_total: "Total",
  invoice_subtotal: "Subtotal",
  invoice_iva: "IVA",
  invoice_comision_percentage: "Comisión Receptor (%)",
  invoice_client_sender: "Razón Social (Emisor)", // <--- Nuevo campo
  invoice_user_assigned: "Usuario asignado del emisor",
  invoice_client_receiver: "Razón Social (Receptor)", // <--- Nuevo campo
  invoice_rfc: "RFC (Receptor)",
};

function CreateInvoiceForm({ api, setCreateShowForm, getPipelines, setSuccess, setSuccessMessage, setLoading, setLoadingMessage, setErrorGeneral,  }) {
  const [users, setUsers] = useState({ results: [] });
  const [client_sender, setClient_sender] = useState([]);
  const [client_receiver, setClient_receiver] = useState([]);
  const [RFC, setRFC] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({ //Solo campos necesarios que se enviarán al back
    invoice_type: "",
    invoice_concept: "",
    invoice_payment_type: "",
    invoice_total: "",
    invoice_comision_percentage: "",
    invoice_subtotal: "",
    invoice_iva: "",
    invoice_client_sender: "", // <--- Nuevo campo
    invoice_client_receiver: "", // <--- Nuevo campo
  });
  const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

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
      setErrorGeneral("Token no encontrado. Por favor, inicia sesión.");
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
      setErrorGeneral("Error al obtener usuarios");
    }
  }, [api, setErrorGeneral]);

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
      setErrorGeneral("Token no encontrado. Por favor, inicia sesión.");
      return;
    }
    try {
      const response = await fetch(`${api}/clients/activencategory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (!response.ok) throw new Error("Error al obtener clientes");
      const data = await response.json();
      setClient_sender(data.despacho);
      setClient_receiver(data.clients);
    } catch (error) {
      console.log("Error al obtener expedientes:", error);
      setErrorGeneral("Error al obtener clientes");
    }
  }, [api, setErrorGeneral]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSubmit = (e) => { //TODO VALIDACIONES SIMPLIFICADAS
    e.preventDefault();
    setErrorMessage(null);
    const validation = validateInvoiceFormData(formData);
    console.log("Validacion", validation);

    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }
    setErrorMessage(null);
      onSubmit(formData);
  };

  const onSubmit = async () => {
    //setLoadingMessage("Enviando información..."); //TODO Esto no funciona
    setLoading(true);
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
      getPipelines();
      setSuccessMessage(SuccessTexts.invoiceCreate);
      setSuccess(true);
    } catch (error) {
      setErrorMessage("Error al crear la factura");
      console.error("Error al crear la factura:", error);
    } finally {
      setCreateShowForm(false);
      setLoading(false);
    }
  };

  // const digitFields = [
  //   "invoice_total",
  //   "invoice_subtotal",
  //   "invoice_iva",
  //   "invoice_comision_percentage",
  // ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, }))
    // if (digitFields.includes(name)) {
    //   const numericValue = value.replace(/\D/g, "");
    //   setFormData((prev) => ({ ...prev, [name]: numericValue }));
    // } else setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "invoice_client_sender") {
      setUsers({ results: [] }); // Limpia antes de la petición
      fetchUsers(value);
    }
    if (name === "invoice_client_receiver") {
      const selectedClient = client_receiver.find(
        (c) => String(c.client_id) === String(value) // Obtenemos el cliente seleccionado y le sacamos el RFC y la comision
      );
      const rfc = selectedClient?.rfc || "";// Extraer el RFC, si existe
      const comision = selectedClient?.comision || 0;
      setRFC(rfc); // Se asigna el valor solo para mostrarlo
      setFormData((prev) => ({...prev, [name]: value, invoice_comision_percentage: comision.toString(),}));  // Se asigna el valor de comision en el formdata para enviarlo y mostrarlo
      return;
    }
    if (name === "invoice_total") {
      // Si no hay valor, limpia
      if (!value) {
        setFormData((prev) => ({
          ...prev,
          invoice_total: "",
          invoice_subtotal: "",
          invoice_iva: "",
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
        invoice_iva: iva.toFixed(2),
      }));
      return; // no seguir con el resto de handleChange para este campo
    }
  };

  //El posicionamiento de los componentes del formData es manual, debido a su naturaleza (a veces enviar, a veces solo mostrar, etc.)
  return (
    <>
      <div
        className={`${styles.form_layout} relative w-[80vw] lg:w-full max-w-5xl max-h-[95vh] flex flex-col`}
      >
        {/* Close Form Button */}
        <button
          onClick={() => setCreateShowForm(false)}
          className={styles.close_form_button}
        >
          ✕
        </button>

        {/* Form Title */}
        <h2 className={styles.form_heading}>Agregar Nueva Factura</h2>
        <div className={errorMessage ? "mb-[-5px]" : ""}>
          {/* Error Message */}
          <AnimatePresence mode="wait">
          {(errorMessage) && (
            <ErrorFormText
              key="form-error-message"
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
            />
          )}
        </AnimatePresence>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`${styles.form} overflow-y-auto max-h-[calc(100vh-120px)]`}
          noValidate
        >
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 max-h-[90vh] overflow-y-auto py-2 px-6 w-full max-w-5xl">
            {/* 1. Tipo de factura */}
            <select
              name="invoice_type"
              value={formData.invoice_type || ""}
              onChange={handleChange}
              required
              className={`${styles.select_form} ${formData.invoice_type ? "text-black font-normal" : "italic text-gray-500"}`}
            >
              {/* PlaceHolder */}
              <option value="" hidden disabled>
                {InvoiceFormKeys.invoice_type}
              </option>
              <option value="PUE">PUE</option>
              <option value="PPD">PPD</option>
            </select>

            {/* 2. Concepto de Factura */}
            <div>
              <input
                type="text"
                name="invoice_concept"
                value={formData.invoice_concept || ""}
                placeholder={InvoiceFormKeys.invoice_concept}
                onChange={handleChange}
                required
                className={styles.input_form}
              />
            </div>

            {/* 3. Método de Pago */}
            <select
              name="invoice_payment_type"
              value={formData.invoice_payment_type || ""}
              onChange={handleChange}
              required
              className={`${styles.select_form} ${formData.invoice_payment_type ? "text-black font-normal" : "italic text-gray-500"}`}
            >
              {/* PlaceHolder */}
              <option value="" hidden disabled>
                {InvoiceFormKeys.invoice_payment_type}
              </option>
              <option value="Ingreso">Efectivo</option>
              <option value="Egreso">Transferencia</option>
              <option value="Traslado">Tarjeta de Débito</option>
              <option value="Nómina">Tarjeta de Crédito</option>
              <option value="Pago">Otro</option>
            </select>

            {/* 4. Campo de fecha no editable */}
            <input
              type="date"
              value={todayDate}
              readOnly
              disabled
              className={`${styles.input_form} text-gray-700`}
            />

            {/* 5. Invoice Total */}
            <div className="relative mt-[-10px]">
              {/* PlaceHolder */}
              <label htmlFor="invoice_total" className="font-inter italic">
                {InvoiceFormKeys.invoice_total}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="invoice_total"
                  value={formData.invoice_total || ""}
                  placeholder={InvoiceFormKeys.invoice_total}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Acepta solo números con hasta 2 decimales
                    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                      handleChange(e);
                    }
                  }}
                  required
                  className={`${styles.input_form} pr-16`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
                  $MXN
                </span>
              </div>
            </div>

            {/* 6. Invoice Comision (Receptor) */}
            <div className="relative mt-[-10px]">
              {/* PlaceHolder */}
              <label htmlFor="invoice_comision_percentage" className="font-inter italic">
                {InvoiceFormKeys.invoice_comision_percentage}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="invoice_comision_percentage"
                  placeholder={InvoiceFormKeys.invoice_comision_percentage}
                  value={formData.invoice_comision_percentage || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Acepta solo números con hasta 2 decimales
                    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                      handleChange(e);
                    }
                  }}
                  disabled
                  required
                  className={`${styles.input_form} pr-16`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
                  %
                </span>
              </div>
            </div>

            {/* 7. Invoice Subtotal */}
            <div className="relative mt-[-10px]">
              {/* PlaceHolder */}
              <label htmlFor="invoice_subtotal" className="font-inter italic">
                {InvoiceFormKeys.invoice_subtotal}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="invoice_subtotal"
                  placeholder={InvoiceFormKeys.invoice_subtotal}
                  value={formData.invoice_subtotal || ""}
                  onChange={handleChange}
                  disabled
                  required
                  className={`${styles.input_form} pr-16`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
                  %
                </span>
              </div>
            </div>

            {/* 8. Invoice IVA */}
            <div className="relative mt-[-10px]">
              {/* PlaceHolder */}
              <label htmlFor="invoice_iva" className="font-inter italic">
                {InvoiceFormKeys.invoice_iva}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="invoice_iva"
                  placeholder={InvoiceFormKeys.invoice_iva}
                  value={formData.invoice_iva || ""}
                  onChange={handleChange}
                  disabled
                  required
                  className={`${styles.input_form} pr-16`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
                  %
                </span>
              </div>
            </div>

            {/* 9. Razon Social (Emisor) */}
            <select
              name="invoice_client_sender"
              value={formData.invoice_client_sender || ""}
              onChange={handleChange}
              required
              className={`${styles.select_form} ${formData.invoice_client_sender ? "text-black font-normal" : "italic text-gray-500"}`}
            >
              {/* PlaceHolder */}
              <option value="" hidden disabled>
                {InvoiceFormKeys.invoice_client_sender}
              </option>
              {client_sender.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.name_rs}
                </option>
              ))}
            </select>

            {/* 10. Invoice Comision (Receptor) */}
            <div className={`${styles.input_form} pr-16`}>
              {users.user_name ? (
                <span className="text-gray-800">{users.user_name}</span>
              ) : (
                <span className="text-gray-400 italic">
                  {InvoiceFormKeys.invoice_user_assigned}
                </span>
              )}
            </div>

            {/* 11. Razon Social (Receptor) */}
            <select
              name="invoice_client_receiver"
              value={formData.invoice_client_receiver || ""}
              onChange={handleChange}
              required
              className={`${styles.select_form} ${formData.invoice_client_receiver ? "text-black font-normal" : "italic text-gray-500"}`}
            >
              {/* PlaceHolder */}
              <option value="" hidden disabled>
                {InvoiceFormKeys.invoice_client_receiver}
              </option>
              {client_receiver.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.name_rs}
                </option>
              ))}
            </select>

            {/* 12. RFC asignado */}
            <div className={`${styles.input_form} pr-16`}>
              {RFC ? (
                <span className="text-gray-800">{RFC}</span>
              ) : (
                <span className="text-gray-400 italic">RFC del Receptor</span>
              )}
            </div>
            {/* CSF asignado */}
            <div className={`${styles.input_form} pr-16`}>
              {RFC ? (
                <span className="text-gray-800">CSF-{RFC}.PDF</span>
              ) : (
                <span className="text-gray-400 italic">CSF del Receptor</span>
              )}
            </div>
          </div>

          {/* Add Invoice Button */}
          <button
            type="submit"
            className={`${styles.send_button} mt-[-5px] mb-2`}
          >
            Agregar Factura
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateInvoiceForm;