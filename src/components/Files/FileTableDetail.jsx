import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles";

const FormattedDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  return formattedDate;
};

function FileTableDetail({
  data,
  onSave,
  userAssigns,
  isEditing,
  setIsEditing,
}) {
  const DiccHead = {
    name_rs: { label: "Razón Social" },
    rfc: { label: "RFC" },
    curp: { label: "CURP" },
    address: { label: "Dirección" },
    zip_code: { label: "Código Postal" },
    phone: { label: "Teléfono" },
    email: { label: "Correo Electrónico" },
    bank_account: { label: "No. Cuenta Bancaria" },
    created_at: { label: "Fecha de creación" },
    user_name: { label: "Usuario Asignado" },
  };

  // TODO: Fix error when deleted
  if (!data || !data.results || data.results.length === 0) {
    return null;
  }

  const [item, setItem] = useState(data.results); // Estado para los datos
  const [originalItem, setOriginalItem] = useState(data.results); // Estado para cancelar cambios

  // Divide las claves en dos mitades
  const keys = Object.keys(DiccHead); // Orden de los campos
  const half = Math.ceil(keys.length / 2);
  const leftKeys = keys.slice(0, half); // Primera mitad de las claves
  const rightKeys = keys.slice(half);

  // Función para manejar el cambio de valor en un campo
  const handleChange = (e, key) => {
    console.log(item); //Quitarlo
    setItem({ ...item, [key]: e.target.value });
  };

  // Función para guardar y preparar los datos modificados para enviarlos al backend
  const handleSave = () => {
    // console.log("Datos actualizados:", item); //Quitarlo
    onSave(item); // Envía los datos al padre
    setIsEditing(false); // Desactivar modo edición después de guardar
  };

  //Función para cancelar cambios
  const handleCancel = () => {
    setItem(originalItem);
    setIsEditing(false);
  };

  const leftTableRef = useRef(null);
  const rightTableRef = useRef(null);

  useEffect(() => {
    const leftRows = leftTableRef.current?.querySelectorAll("tr");
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
  }, [item, isEditing]);

  return (
    <>
      {/* bg-white rounded-2xl shadow-sm border border-gray-200 */}
      <div className={`${styles.d_table_container}`}>
        {/* Tabla izquierda */}
        <div className={`${styles.d_table_column_container}`}>
          <h2 className={`${styles.d_table_heading}`}>Datos Generales</h2>
          <table ref={leftTableRef} className={`${styles.d_table}`}>
            <tbody>
              {leftKeys.map((key, index) => (
                <tr key={key} className="align-center">
                  <th
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_header} ${
                      index === leftKeys.length - 1 ? "" : "border-b-6"
                    } w-1/3 sm:w-1/4`}
                  >
                    {DiccHead[key].label}
                  </th>
                  <td
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_data} ${isEditing ? "" : ""} ${
                      index === leftKeys.length - 1 ? "" : "border-b-6"
                    }`}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={item[key] || ""}
                        onChange={(e) => handleChange(e, key)}
                        // className={`${styles.d_table_input}`}
                        className={`w-full p-2 rounded-md italic shadow-stone-300 font-inter placeholder:italic focus:ring-2 focus:ring-[#fff0] focus:scale-105  transition-all  px-3 py-2 focus:outline-none`}

                      />
                    ) : (
                      item[key] ?? "—"
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
                    className={`${styles.d_table_header} ${
                      index === leftKeys.length - 1 ? "" : "border-b-6"
                    } w-1/3`}
                  >
                    {DiccHead[key].label}
                  </th>
                  <td
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                    className={`${styles.d_table_data} ${
                      index === leftKeys.length - 1 ? "" : "border-b-6"
                    }`}
                  >
                    {key === "created_at" ? (
                      <p>{FormattedDate(item[key])}</p>
                    ) : isEditing && key === "user_name" ? (
                      <select
                        onChange={(e) => handleChange(e, "user_name")}
                        className={`${styles.select_form} w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
                        required
                      >
                        <option key={key} value={item[key] || ""}>
                          {item[key] || ""}
                        </option>
                        {userAssigns
                          .filter(
                            ({ user_name }) => user_name !== item.user_name
                          )
                          .map(({ user_id, user_name }) => (
                            <option key={user_id} value={user_name}>
                              {user_name}
                            </option>
                          ))}
                      </select>
                    ) : isEditing ? (
                      <input
                        type="text"
                        value={item[key] || ""}
                        onChange={(e) => handleChange(e, key)}
                        // className={`${styles.d_table_input}`}
                        className={`w-full p-2 rounded-md italic shadow-stone-300 font-inter placeholder:italic focus:ring-2 focus:ring-[#fff0] focus:scale-105  transition-all  px-3 py-2 focus:outline-none`}

                      />
                    ) : (
                      item[key] || "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botones de acción */}
      {isEditing && (
        <div className="flex gap-4 my-[-10px] justify-center items-center">
          <button
            onClick={handleSave}
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
      )}
    </>
  );
}

export default FileTableDetail;
