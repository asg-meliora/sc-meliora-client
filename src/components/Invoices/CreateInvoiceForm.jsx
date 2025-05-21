import React, { useCallback, useEffect, useState } from "react";
import styles from "../../styles";
import Cookies from "js-cookie";
import { validateInvoiceFormData } from "../../validations";

import { SuccessTexts } from "../../constants/Texts";
import ErrorFormText from "../ErrorFormText";
import { AnimatePresence } from "framer-motion";

const InvoiceFormKeys = {
  invoice_concept: "Concepto de Factura",
  invoice_cdfi: "Uso de CDFI",
  invoice_payment_type: "Forma de Pago",
  invoice_regimen: "Régimen Fiscal",
  invoice_type: "Método de Pago",
  invoice_user_assigned: "Usuario asignado del emisor",
  invoice_client_sender: "Razón Social (Emisor)",
  invoice_client_receiver: "Razón Social (Receptor)", 
  invoice_rfc: "RFC (Receptor)",
  invoice_subtotal: "Subtotal",
  invoice_iva: "IVA",
  invoice_total: "Total",
  invoice_comision_percentage: "Comisión Receptor (%)",
};

function CreateInvoiceForm({
  api,
  setCreateShowForm,
  getPipelines,
  setSuccess,
  setSuccessMessage,
  setLoading,
  setLoadingMessage,
  setErrorGeneral,
}) {
  const [users, setUsers] = useState({ results: [] });
  const [client_sender, setClient_sender] = useState([]);
  const [client_receiver, setClient_receiver] = useState([]);
  const [RFC, setRFC] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({
    // invoice_date
    invoice_concept: "",
    invoice_cdfi: "",
    invoice_payment_type: "",
    invoice_regimen: "",
    invoice_type: "",
    // invoice_user_assigned
    invoice_client_sender: "", 
    invoice_client_receiver: "", 
    // invoice_rfc
    // invoice_csf
    invoice_subtotal: "",
    invoice_iva: "",
    invoice_total: "",
    invoice_comision_percentage: "",
  });
  /*
  // const [formData, setFormData] = useState({ //Solo campos necesarios que se enviarán al back
  //   invoice_type: "",
  //   invoice_concept: "",
  //   invoice_payment_type: "",
  //   invoice_total: "",
  //   invoice_comision_percentage: "",
  //   invoice_subtotal: "",
  //   invoice_iva: "",
  //   invoice_client_sender: "", // <--- Nuevo campo
  //   invoice_client_receiver: "", // <--- Nuevo campo
  // });
  */
  const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  /**
   * Function that fetches the list of users from the server and updates the user board state
   * @async
   * @function fetchUsers
   * @returns {Promise<void>} Promise that resolves when users are fetched correctly & its state changes
   * @throws {Error} Throws error if the request fails
   */
  const fetchUsers = useCallback(
    async (client_id) => {
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
    },
    [api, setErrorGeneral]
  );

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

  const handleSubmit = (e) => {
    //TODO VALIDACIONES SIMPLIFICADAS
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
    setLoadingMessage("Enviando información..."); //TODO Esto no funciona
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const rfc = selectedClient?.rfc || ""; // Extraer el RFC, si existe
      const comision = selectedClient?.comision || 0;
      setRFC(rfc); // Se asigna el valor solo para mostrarlo
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        invoice_comision_percentage: comision.toString(),
      })); // Se asigna el valor de comision en el formdata para enviarlo y mostrarlo
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
      return;
    }
  };

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
            {errorMessage && (
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
            <div className="flex flex-col gap-3">
              {/* 1. Campo de fecha no editable */}
              <input
                type="date"
                value={todayDate}
                readOnly
                disabled
                className={`${styles.input_form} text-gray-700`}
              />
              {/* 2. Concepto de Factura */}
              <input
                type="text"
                name="invoice_concept"
                value={formData.invoice_concept || ""}
                placeholder={InvoiceFormKeys.invoice_concept}
                onChange={handleChange}
                required
                className={styles.input_form}
              />
              {/* 3. Uso de CDFI */}
              <select
                name="invoice_cdfi"
                value={formData.invoice_cdfi || ""}
                onChange={handleChange}
                required
                className={`${styles.select_form} ${
                  formData.invoice_cdfi
                    ? "text-black font-normal"
                    : "italic text-gray-500"
                }`}
              >
                <option value="" hidden disabled>
                  {InvoiceFormKeys.invoice_cdfi}
                </option>
                <option value="G03">G03-Gasto General</option>
              </select>
              {/* 4. Forma de pago */}
              <select
                name="invoice_payment_type"
                value={formData.invoice_payment_type || ""}
                onChange={handleChange}
                required
                className={`${styles.select_form} ${
                  formData.invoice_payment_type
                    ? "text-black font-normal"
                    : "italic text-gray-500"
                }`}
              >
                <option value="" hidden disabled>
                  {InvoiceFormKeys.invoice_payment_type}
                </option>
                <option value="credito">Tarjeta de Crédito</option>
                <option value="debito">Tarjeta de Débito</option>
                <option value="transferencia">Transferencia electrónica</option>
                <option value="cheque">Cheque Nominativo</option>
                <option value="efectivo">Efectivo</option>
              </select>
              {/* 5. Regimen Fiscal */}
              <select
                name="invoice_regimen"
                value={formData.invoice_regimen || ""}
                onChange={handleChange}
                required
                className={`${styles.select_form} ${
                  formData.invoice_regimen
                    ? "text-black font-normal"
                    : "italic text-gray-500"
                }`}
              >=
                <option value="" hidden disabled>
                  {InvoiceFormKeys.invoice_regimen}
                </option>
                <option value="601">601 - General de Ley de Personas Morales</option>
                <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                <option value="605">605 - Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                <option value="606">606 - Arrendamiento</option>
                <option value="607">607 - Régimen de Enajenación o Adquisición de Bienes</option>
                <option value="608">608 - Demás Ingresos</option>
                <option value="610">610 - Residentes en el Extranjero sin Establecimiento Permanente en México</option>
                <option value="611">611 - Ingresos por Dividendos (socios y accionistas)</option>
                <option value="612">612 - Personas Físicas con Actividades Empresariales y Profesionales</option>
                <option value="614">614 - Ingresos por intereses</option>
                <option value="615">615 - Régimen de los ingresos por obtención de premios</option>
                <option value="616">616 - Sin obligaciones fiscales</option>
                <option value="620">620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos</option>
                <option value="621">621 - Incorporación Fiscal</option>
                <option value="622">622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                <option value="623">623 - Opcional para Grupos de Sociedades</option>
                <option value="624">624 - Coordinados</option>
                <option value="625">625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas</option>
                <option value="626">626 Régimen Simplificado de Confianza</option>
              </select>
              {/* 6. Metodo de pago */}
              <select
                name="invoice_type"
                value={formData.invoice_type || ""}
                onChange={handleChange}
                required
                className={`${styles.select_form} ${
                  formData.invoice_type
                    ? "text-black font-normal"
                    : "italic text-gray-500"
                }`}
              >
                <option value="" hidden disabled>
                  {InvoiceFormKeys.invoice_type}
                </option>
                <option value="PUE">Pago en una sola exhibición</option>
                <option value="PPD">Pago en parcialidades</option>
              </select>

              {/* Divider */}
              <div className="hidden md:inline py-18 "></div>

              {/* 7. Usuario asignado */}
              <div className={`${styles.input_form} pr-16`}>
                {users.user_name ? (
                  <span className="text-gray-800">{users.user_name}</span>
                ) : (
                  <span className="text-gray-400 italic">
                    {InvoiceFormKeys.invoice_user_assigned}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {/* 8. Razon Social (Emisor) */}
              <select
                name="invoice_client_sender"
                value={formData.invoice_client_sender || ""}
                onChange={handleChange}
                required
                className={`${styles.select_form} ${
                  formData.invoice_client_sender
                    ? "text-black font-normal"
                    : "italic text-gray-500"
                }`}
              >
                <option value="" hidden disabled>
                  {InvoiceFormKeys.invoice_client_sender}
                </option>
                {client_sender.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.name_rs}
                  </option>
                ))}
              </select>
              {/* 9. Razon Social (Receptor) */}
              <select
                name="invoice_client_receiver"
                value={formData.invoice_client_receiver || ""}
                onChange={handleChange}
                required
                className={`${styles.select_form} ${
                  formData.invoice_client_receiver
                    ? "text-black font-normal"
                    : "italic text-gray-500"
                }`}
              >
                <option value="" hidden disabled>
                  {InvoiceFormKeys.invoice_client_receiver}
                </option>
                {client_receiver.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.name_rs}
                  </option>
                ))}
              </select>
              {/* 10. RFC asignado */}
              <div className={`${styles.input_form} pr-16`}>
                {RFC ? (
                  <span className="text-gray-800">{RFC}</span>
                ) : (
                  <span className="text-gray-400 italic">RFC del Receptor</span>
                )}
              </div>
              {/* 11. CSF del Receptor */}
              <div className={`${styles.input_form} pr-16`}>
                {RFC ? (
                  <span className="text-gray-800">CSF-{RFC}.PDF</span>
                ) : (
                  <span className="text-gray-400 italic">CSF del Receptor</span>
                )}
              </div>

              {/* Divider */}
              <div className="hidden md:inline py-3"></div>

              {/* 12. Invoice Subtotal */}
              <div className="relative mt-[-10px]">
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
              {/* 13. Invoice IVA */}
              <div className="relative mt-[-10px]">
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
              {/* 14. Invoice Total */}
              <div className="relative mt-[-10px]">
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
              {/* 15. Invoice Comision (Receptor) */}
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
}

export default CreateInvoiceForm;
