import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "../../styles";

import { validateFileFormData } from "../../validations";
import { constructFromSymbol } from "date-fns/constants";
import { SuccessTexts } from "../../constants/Texts";

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
  onAddFile,
  setLoading,
  setLoadingMessage,
  setSuccess,
  setSuccessMessage,
  getClients,
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name_rs: "",
    rfc: "",
    curp: "",
    street: "", //Nuevos campos de Dirección
    ext_number: "",
    int_number: "",
    neighborhood: "",
    municipality: "",
    state: "",
    zip_code: "",
    phone: "",
    email: "",
    bank_account: "",
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateFileFormData(formData);
    console.log("Validacion", validation);

    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    setErrorMessage(null);
    onSubmit(formData);
  };

  const onSubmit = async () => {
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
    // try {
    //   const response = await fetch(`${api}/clients/complete`, {
    //     method: "POST",
    //     headers: { "x-access-token": Cookies.get("token") },
    //     body: data,
    //   });

    //   if (!response.ok) throw new Error("Error al crear el cliente");

    //   const result = await response.json();
    //   getClients();
    //   setSuccessMessage("El expediente se ha creado correctamente.");
    //   setSuccess(true);
    // } catch (error) {
    //   setErrorMessage(
    //     error.message || "Hubo un error en el servidor. Inténtalo de nuevo."
    //   );
    //   setErrorExist(true);
    // } finally {
    //   setLoading(false);
    // }
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
        {errorMessage && (
          <div className={styles.error_message}>{errorMessage}</div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className={`${styles.form} overflow-y-auto max-h-[calc(100vh-120px)]`}
        noValidate
      >
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 max-h-[90vh] overflow-y-auto py-2 px-6 w-full max-w-5xl">
          {/* Form Fields */}
          {Object.entries(formData).map(([key, value]) =>
            // key.startsWith("file") ? ( // Renderizar el nuevo campo "Files"
            //   <FileInput
            //     key={key}
            //     name={key}
            //     file={value}
            //     onChange={handleFileChange}
            //     label={DiccLabels[key].label}
            //   />
            // ) :
            key === "category" ? ( // Renderizar el nuevo campo "Category"
              <select
                key={key}
                name={key}
                value={formData.category || ""}
                onChange={handleInputChange}
                className={`${styles.select_form} col-span-2  ${
                  formData.category
                    ? "text-black font-normal"
                    : "italic text-gray-500"
                }`}
                required
              >
                <option value="" hidden disabled>
                  Categoría
                </option>
                <option value="Despacho">Despacho</option>
                <option value="Clientes">Clientes</option>
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
