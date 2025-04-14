import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "../../styles";

//Diccionario para los labels del formulario
const DiccLabels = {
  name_rs: { label: "Razón Social" },
  rfc: { label: "RFC" },
  curp: { label: "CURP" },
  address: { label: "Dirección" },
  zip_code: { label: "Código Postal" },
  phone: { label: "Teléfono" },
  email: { label: "Correo Electrónico" },
  bank_account: { label: "No. Cuenta Bancaria" },
  fileCSF: { label: "CSF" },
  fileCDB: { label: "Comprabante de Domicilio" },
  fileCDD: { label: "Carátula Bancaria" },
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
      <p className="text-sm text-gray-700">Archivo Seleccionado: {file.name}</p>
    )}
  </div>
);

function FilesCreate({ api, isOpen, onClose, children, onAddFile }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name_rs: "",
    rfc: "",
    curp: "",
    address: "",
    zip_code: "",
    phone: "",
    email: "",
    bank_account: "",
    userAssign: "",
    fileCSF: null,
    fileCDB: null,
    fileCDD: null,
  });

  const [userAssigns, setuserAssigns] = useState({ results: [] });

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

  console.log(formData); //QUITARLO

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      console.log(response);
      if (!response.ok) throw new Error("Error al crear el cliente");

      const result = await response.json();
      if (result.client_id) {
        const clientResponse = await fetch(
          `${api}/clients/byid/${result.client_id}`,
          {
            headers: { "x-access-token": Cookies.get("token") },
          }
        );
        if (!clientResponse.ok)
          throw new Error("Error al obtener los datos del cliente");
        const newClient = await clientResponse.json();
        onAddFile(newClient.results);
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      // alert(error.message);
    }
  };

  return (
    <div className={`${styles.form_layout} relative w-full max-w-5xl`}>
      {/* Close Form Button */}
      <button onClick={onClose} className={styles.close_form_button}>
        ✕
      </button>

      {/* Form Title */}
      <h2 className={styles.form_heading}>Agregar Nuevo Expediente</h2>
      <form onSubmit={handleSubmit} className={`${styles.form}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[90vh] overflow-y-auto p-6 w-full max-w-5xl">
          {/* Error Message */}
          {/* {(errorMessage || serverErrorMessage) && (
          <div className={styles.error_message}>
            {errorMessage ? errorMessage : serverErrorMessage}
          </div>
        )} */}
          {/* Form Fields */}
          {Object.entries(formData).map(([key, value]) =>
            key.startsWith("file") ? (
              <FileInput
                key={key}
                name={key}
                file={value}
                onChange={handleFileChange}
                label={DiccLabels[key].label}
              />
            ) : (
              key !== "userAssign" && (
                <TextInput
                  key={key}
                  placeholder={DiccLabels[key].label}
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
        <button type="submit" className={`${styles.send_button} mt-[-20px]`}>
          {" "}
          Agregar Expediente
        </button>
      </form>
    </div>
  );
}

export default FilesCreate;
