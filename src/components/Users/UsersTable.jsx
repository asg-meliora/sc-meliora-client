// import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import styles from "../../styles";

import { FaEdit, FaRegTrashAlt } from "react-icons/fa";

const UsersTable = ({ handleOpenUserForm, dataBoard, handleOpenUserDelete }) => {
  /**
   * Function that returns the user type in a readable format
   * @function formatUserType
   * @param {number} type - Id of the user type
   * @returns  {string} - Formatted user type for showing in table
   */
  const formatUserType = (type) => {
    const types = {
      1: "Administrador",
      2: "Usuario",
      3: "Broker",
      4: "Lectura",
    };
    return types[type] || "Desconocido";
  };

  const getUserTypeColor = (type) => {
    const colors = {
      1: "bg-[#404040] shadow-gray-500/70 shadow-lg",
      2: "bg-[#a67a37] shadow-amber-500/30 shadow-lg",
      3: "bg-[#8C8C8C] shadow-gray-400/50 shadow-lg",
      4: "bg-[#aba391] shadow-amber-100/30 shadow-lg",
    };
    return colors[type] || "bg-gray-500";
  };

  /**
   * Function that formats the date string from server to dd/MM/yyyy format
   * @function formatDate
   * @param {string} dateString - Date string to be formatted
   * @returns {string} - Formatted date string in dd/MM/yyyy format
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className={styles.table_layout}>
      <div className={styles.table_container}>
        <table className={`${styles.table} rounded-2xl`}>
          <thead className={styles.table_header}>
            <tr>
              <th className={`${styles.table_header_cell}`}>Nombre</th>
              <th className={`${styles.table_header_cell}`}>Tipo</th>
              <th
                className={`${styles.table_header_cell} hidden md:table-cell`}
              >
                Email
              </th>
              <th
                className={`${styles.table_header_cell} hidden sm:table-cell`}
              >
                Estado
              </th>
              <th
                className={`${styles.table_header_cell} hidden lg:table-cell`}
              >
                Creación
              </th>
              <th className={`${styles.table_header_cell}`}>Acciones</th>
            </tr>
          </thead>
          <tbody className={styles.table_body}>
            {dataBoard.results.map((user, index) => (
              <tr
                key={user.user_id}
                className={`border-b-[2.5px] border-[#b9b9b9]  last:border-none ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"
                } hover:bg-[#313131] hover:text-white transition-all`}
              >
                <td className="p-4 text-center font-semibold break-all">
                  {user.user_name}
                </td>
                <td className="p-4 text-center ">
                  <span
                    className={`px-3 py-1 items-center text-xs font-bold rounded-full text-white shadow-md ${getUserTypeColor(
                      user.role_id
                    )}`}
                  >
                    {formatUserType(user.role_id)}
                  </span>
                </td>
                <td className="p-4 text-center hidden md:table-cell">
                  {user.email}
                </td>
                <td className="p-4 text-center hidden sm:table-cell">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full text-white shadow-md ${
                      user.is_active === 1
                        ? "bg-green-500 shadow-green-500/50"
                        : "bg-gray-500 shadow-gray-500/50 shadow-lg"
                    }`}
                  >
                    {user.is_active === 1 ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-4 text-center hidden lg:table-cell">
                  {formatDate(user.created_at)}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleOpenUserForm(user)}
                    className="text-[#9e824f]  hover:text-[#eeb13f] pr-1.5 hover:cursor-pointer transition-all transform hover:scale-120"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => {handleOpenUserDelete(user.user_id)}}
                    className="text-[#9e824f] hover:text-[#eeb13f] pl-1.5 scale-100 hover:cursor-pointer transition-all transform hover:scale-150"
                  >
                    <FaRegTrashAlt size={18} />
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
