import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles";

const FormattedDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  return formattedDate;
};

const DiccHead = {
  name_rs: { label: "Razón Social" },
  rfc: { label: "RFC" },
  curp: { label: "CURP" },
  address: { label: "Dirección" },
  zip_code: { label: "Código Postal" },
  created_at: { label: "Fecha de creación" },
  phone: { label: "Teléfono" },
  email: { label: "Correo Electrónico" },
  bank_account: { label: "No. Cuenta Bancaria" },
  user_name: { label: "Usuario Asignado" },
  comision: { label: "Comisión (%)" },
  category: { label: "Categoría" },
};
const addressKeys = {
  street: "Calle",
  ext_number: "Numero Exterior",
  int_number: "Numero Interior",
  neighborhood: "Colonia",
  municipality: "Municipio",
  state: "Estado",
};
const categoryLabels = {
  ClientesEmisor: "Despacho",
  ClientesReceptor: "Cliente",
};

export default function FileTableDetail({ data, onSave, userAssigns, isEditing, setIsEditing, }) {
  const [formData, setFormData] = useState({}); // Estado para los campos simples
  const [campoEspecial, setCampoEspecial] = useState({}); // Estado para los campos de dirección

  // Divide las claves en dos mitades
  const keys = Object.keys(DiccHead); // Orden de los campos
  const half = Math.ceil(keys.length / 2);
  const leftKeys = keys.slice(0, half); // Primera mitad de las claves
  const rightKeys = keys.slice(half);
  const address = data.address_fields; //Manejo de address

  // Función para resetear estados a los datos originales
  const resetForm = () => {
    setFormData({
      name_rs: data?.name_rs || "",
      rfc: data?.rfc || "",
      curp: data?.curp || "",
      address: data?.address || "",
      zip_code: data?.zip_code || "",
      phone: data?.phone || "",
      email: data?.email || "",
      bank_account: data?.bank_account || "",
      created_at: data?.created_at || "",
      user_name: data?.user_name || "",
      category: data?.category || "",
      comision: data?.comision || "",
    });

    setCampoEspecial({
      street: data.address_fields?.street || "",
      ext_number: data.address_fields?.ext_number || "",
      int_number: data.address_fields?.int_number || "",
      neighborhood: data.address_fields?.neighborhood || "",
      municipality: data.address_fields?.municipality || "",
      state: data.address_fields?.state || "",
    });
  };

  const leftTableRef = useRef(null);
  const rightTableRef = useRef(null);
  useEffect(() => {   // Cada vez que cambia 'isEditing' o 'data', reseteamos el formulario
    if (data) {       // Esto asegura que cuando entres o salgas del modo edición o cambie la data,
      resetForm();    // los campos se inicialicen/restauren con los valores originales recibidos.
    }
    const leftRows = leftTableRef.current?.querySelectorAll("tr");//Para Responsive de ambas tablas
    const rightRows = rightTableRef.current?.querySelectorAll("tr");

    if (!leftRows || !rightRows) return;

    const numRows = Math.max(leftRows.length, rightRows.length);

    for (let i = 0; i < numRows; i++) {
      const leftRow = leftRows[i];
      const rightRow = rightRows[i];

      if (!leftRow || !rightRow) continue;

      // Reset height first
      leftRow.style.height = "auto";
      rightRow.style.height = "auto";

      const leftHeight = leftRow.offsetHeight;
      const rightHeight = rightRow.offsetHeight;
      const maxHeight = Math.max(leftHeight, rightHeight);

      leftRow.style.height = `${maxHeight}px`;
      rightRow.style.height = `${maxHeight}px`;
    }
  }, [isEditing, data]);

  // Función para manejar el cambio de valor en un campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, }));
  };

  // Función para manejar cambios en el campo especial
  const handleEspecialChange = (e) => {
    const { name, value } = e.target;
    setCampoEspecial((prev) => ({ ...prev, [name]: value, }));
  };

  // Función para guardar y preparar los datos modificados para enviarlos al backend
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedForm = {
      ...formData,
      ...campoEspecial, // <-- Aquí se añaden los campos de dirección separados
      address: null,     // Opcional: eliminar el campo original si no lo quieres enviar
      created_at: null 
    };
    console.log("Datos Enviados", updatedForm); //Quitarlo
    onSave(updatedForm);
    setIsEditing(false);// Desactivar modo edición después de guardar
  };

  //Función para cancelar cambios
  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  return (
    <>
      {/* bg-white rounded-2xl shadow-sm border border-gray-200 */}
      <div className={`${styles.d_table_container}`}>
        {/* <form onSubmit={handleSubmit}> */}
        {/* Tabla izquierda */}
        <div className={`${styles.d_table_column_container}`}>
          <h2 className={`${styles.d_table_heading}`}>Datos Generales</h2>
          <table ref={leftTableRef} className={`${styles.d_table}`}>
            <tbody>
              {(leftKeys).map((key, index) => (
                <tr key={key} className="align-center">
                  <th
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_header} ${index === leftKeys.length - 1 ? "" : "border-b-6"
                      } w-1/3 sm:w-1/4`}
                  >
                    {DiccHead[key].label}
                  </th>
                  <td
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_data} ${isEditing ? "" : ""} ${index === leftKeys.length - 1 ? "" : "border-b-6"
                      }`}
                  >
                    {isEditing ? ( // Si esta editando
                      key === "address" ? ( //Si esta en address, agrega los subcampos correspondientes (son 6 subcampos)
                        <div>
                          {Object.keys(address).map((key) => (
                            <fieldset key={key} className="inline-block border border-[#ccc] py-2 rounded-lg sm:max-w-1/2 w-full break-words">
                              <legend className="text-gray-700 font-bold font-raleway ml-2">{addressKeys[key]}</legend>
                              <input
                                type="text"
                                className="ml-2"
                                name={key}
                                value={campoEspecial[key] ?? ""}
                                onChange={handleEspecialChange}
                              />
                            </fieldset>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          name={key}
                          value={key === "created_at" ? FormattedDate(data[key]) : formData[key] ?? "—"} // En editable, se formatea fecha 
                          onChange={handleChange}
                          required
                          disabled={key === "created_at"} // Se desactiva el edidable solo si es "created_at"
                          className={`w-full p-2 rounded-md italic shadow-stone-300 font-inter placeholder:italic focus:ring-2 focus:ring-[#fff0] focus:scale-105 transition-all px-3 py-2 focus:outline-none`}
                        />
                      )
                    ) : (
                      <span>{key === "created_at" ? FormattedDate(data[key]) : data[key] ?? "—"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla derecha */}
        <div className={`${styles.d_table_column_container}`}>
          <h2 className={`${styles.d_table_heading}`}>Información adicional</h2>
          <table ref={rightTableRef} className={`${styles.d_table}`}>
            <tbody>
              {rightKeys.map((key, index) => (
                <tr key={key} className="align-center">
                  <th
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_header} ${index === rightKeys.length - 1 ? "" : "border-b-6"} w-1/3`}
                  >
                    {DiccHead[key].label}:
                  </th>
                  <td
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_data} ${index === rightKeys.length - 1 ? "" : "border-b-6"}`}
                  >
                    {isEditing ? (  //Si esta editando
                      key === "user_name" ? ( //Si esta en UserName, les permite elegir otro usuario
                        <select
                          name="user_name"
                          value={formData.user_name ?? ""}
                          onChange={handleChange}
                          className={`${styles.select_form} w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
                          required
                        >
                          <option key={key} value={data[key] || ""}>
                            {data[key] || ""}
                          </option>
                          {userAssigns.filter(({ user_name }) => user_name !== data.user_name).map(({ user_id, user_name }) => (
                            <option key={user_id} value={user_name}>
                              {user_name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name={key}
                          value={key === "category" ? categoryLabels[formData["category"]] : formData[key] ?? ""} // En editable, se formatea category
                          onChange={handleChange}
                          required
                          disabled={key === "category"} // Se desactiva el edidable solo si es "category"
                          className={`w-full p-2 rounded-md italic shadow-stone-300 font-inter placeholder:italic focus:ring-2 focus:ring-[#fff0] focus:scale-105  transition-all  px-3 py-2 focus:outline-none`}
                        />
                      )
                    ) : (
                      <span>{categoryLabels[data[key]] ?? data[key] ?? "—"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div >

      {/* Botones de acción */}
      {
        isEditing && (
          <div className="flex gap-4 my-[-10px] justify-center items-center">
            <button
              // type="submit"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl confirmButton text-white font-medium font-inter shadow-md shadow-green-800/50 hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
            >
              Guardar Cambios
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2 rounded-xl logoutButton text-white font-medium font-inter shadow-md shadow-red-800/50 hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
            >
              Cancelar
            </button>
          </div>
        )
      }
      {/* </form> */}
    </>
  );
}