import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "../../styles";

import { validateFileFormData } from "../../validations";
import { SuccessTexts } from "../../constants/Texts";
import { AnimatePresence } from "framer-motion";
import ErrorFormText from "../ErrorFormText";

//Diccionario para los labels del formulario
const DiccLabels = {
  name_rs: "Razón Social",
  rfc: "RFC",
  curp: "CURP",
  street: "Calle", //Nuevos campos de Dirección
  ext_number: "Número Exterior",
  int_number: "Número Interior",
  neighborhood: "Colonia",
  municipality: "Municipio",
  state: "Estado",
  zip_code: "Codigo Postal",
  phone: "Teléfono",
  email: "Correo Electrónico",
  bank_account: "No. Cuenta Bancaria",
  comision: "Comisión (%)",
  fileCSF: "CSF",
  fileCDB: "Comprabante de Domicilio",
  fileCDD: "Carátula Bancaria",
};

const TextInput = ({ placeholder, name, value, onChange, type = "text" }) => (
  <input
    type={type}
    name={name}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    className={styles.input_form}
    required
  />
);

const FileInput = ({ name, onChange, file, label }) => (
  <div className="flex flex-col gap-2 col-span-2">
    <label htmlFor={name} className="text-base font-semibold text-gray-700">
      {" "}
      Subir archivo {label}
    </label>
    <input
      id={name}
      type="file"
      name={name}
      onChange={onChange}
      className={styles.input_file}
      accept="application/pdf, .pdf"
      required
    />
    {file && (
      <p className=" ml-3 mt-[-5px] text-sm text-gray-700">
        Archivo Seleccionado: {file.name}
      </p>
    )}
  </div>
);

function FilesCreate({
  api,
  isOpen,
  onClose,
  setLoading,
  setLoadingMessage,
  setSuccess,
  setSuccessMessage,
  getClients,
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name_rs: "",
    street: "", //Nuevos campos de Dirección
    rfc: "",
    ext_number: "",
    curp: "",
    int_number: "",
    bank_account: "",
    neighborhood: "",
    comision: "",
    municipality: "",
    phone: "",
    state: "",
    email: "",

    zip_code: "",
    category: "",
    userAssign: "",
    fileCSF: null,
    fileCDB: null,
    fileCDD: null,
  });

  const [userAssigns, setuserAssigns] = useState({ results: [] });
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async (api) => {
      const response = await fetch(`${api}/users/byregnact`, {
        method: "GET",
        headers: { "x-access-token": Cookies.get("token") },
      });
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setuserAssigns(data);
    };
    fetchUsers(api);
  }, [api]);

  const upperCaseFields = ["rfc", "curp", "bank_account"];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: upperCaseFields.includes(name) ? value.toUpperCase() : value,
    }));
  };

  const handleFileChange = (e) => { //Manejo de subida de archivos, y manejo de errores y limites
    const { name, files } = e.target;
    const file = files[0];
    const maxSizeMB = 2;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file) {
      const isPdf = file.type === "application/pdf";

      if (!isPdf) {
        setErrorMessage(`Solo se permiten archivos en formato PDF, revisa tu archivo ${DiccLabels[name]}`);//Rechazar si no es pdf
        setFormData((prev) => ({ ...prev, [name]: null }));
        e.target.value = null; // Limpia el input para permitir seleccionar el mismo archivo otra vez
      } else if (file.size > maxSizeBytes) {
        setErrorMessage(`El archivo ${DiccLabels[name]} supera el límite de ${maxSizeMB}MB`);//Rechazar si pesa mucho
        setFormData((prev) => ({ ...prev, [name]: null }));
        e.target.value = null; // Limpia el input para permitir seleccionar el mismo archivo otra vez
      } else {
        setErrorMessage((prev) => ({ ...prev, [name]: null }));
        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    }
  };

  const handleSubmit = async (e) => { //Manejo de Validaciones ANTES de insertar los datos al sistema
    e.preventDefault();

    const validation = validateFileFormData(formData);
    console.log("Validacion", validation);

    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }
    setErrorMessage(null);

    // Paso 1: Validar campos simples sin archivos
    try {
      const plainData = {
        name_rs: formData.name_rs,
        rfc: formData.rfc,
        curp: formData.curp
      };
      const validarRes = await fetch(`${api}/clients/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
        body: JSON.stringify(plainData),
      });
      if (!validarRes.ok) {
        const err = await validarRes.json();
        throw new Error(err.error || "Error en validación");
      }
      // Si validación pasa, continúa con el envío completo
      onSubmit();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };


  const onSubmit = async () => { //Manejo de Insertar Datos y Archivos al sistema
    setLoadingMessage("Enviando información...");
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    console.log("Contenido de FormData:");
    for (let pair of data.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    try {
      const response = await fetch(`${api}/clients/complete`, {
        method: "POST",
        headers: { "x-access-token": Cookies.get("token") },
        body: data,
      });

      if (!response.ok) throw new Error("Error al crear el cliente");

      const result = await response.json();
      getClients();
      setSuccessMessage("El expediente se ha creado correctamente.");
      setSuccess(true);
      onClose();
    } catch (error) {
      setErrorMessage(
        error.message || "Hubo un error en el servidor. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div
      className={`${styles.form_layout} relative w-[80vw] lg:w-full max-w-5xl max-h-[95vh] flex flex-col`}
    >
      {/* Close Form Button */}
      <button onClick={onClose} className={styles.close_form_button}>
        ✕
      </button>

      {/* Form Title */}
      <h2 className={`${styles.form_heading}`}>Agregar Nuevo Expediente</h2>
      <div className={errorMessage ? "mb-[-5px]" : ""}>
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
          {/* Form Fields */}
          {Object.entries(formData).map(([key, value]) =>
            key.startsWith("file") ? ( // Renderizar el nuevo campo "Files"
              <FileInput
                key={key}
                name={key}
                file={value}
                onChange={handleFileChange}
                label={DiccLabels[key]}
              />
            ) :
              key === "category" ? ( // Renderizar el nuevo campo "Category"
                <select
                  key={key}
                  name={key}
                  value={formData.category || ""}
                  onChange={handleInputChange}
                  className={`${styles.select_form} col-span-2  ${formData.category ? "text-black font-normal" : "italic text-gray-500"}`}
                  required
                >
                  <option value="" hidden disabled>
                    Categoría
                  </option>
                  <option value="ClientesEmisor">Despacho</option>
                  <option value="ClientesReceptor">Clientes</option>
                </select>
              ) : (
                key !== "userAssign" && ( // Renderizar todos los campos tipo "Text"
                  <TextInput
                    key={key}
                    placeholder={DiccLabels[key]}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                  />
                )
              )
          )}
          <select
            name="userAssign"
            value={formData.userAssign || ""}
            onChange={handleInputChange}
            className={`${styles.select_form} col-span-2  ${
              formData.userAssign
                ? "text-black font-normal"
                : "italic text-gray-500"
            }`}
            required
          >
            <option value="" hidden disabled>
              Usuario asignado
            </option>
            {userAssigns.results.map(({ user_id, user_name }) => (
              <option key={user_id} value={user_name}>
                {user_name}
              </option>
            ))}
          </select>
        </div>
        {/* Add File Button */}
        <button type="submit" className={`${styles.send_button} mb-2`}>
          {" "}
          Agregar Expediente
        </button>
      </form>
    </div>
  );
}

export default FilesCreate;
