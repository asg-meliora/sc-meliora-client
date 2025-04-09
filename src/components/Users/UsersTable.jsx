// import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";

import { FaEdit, FaRegTrashAlt } from "react-icons/fa";

const UsersTable = ({ handleOpenUserForm, dataBoard }) => {
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
  }

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
    <div className="px-2 w-full mt-0.5 ">
      <div className="overflow-x-auto bg-whiteN p-4">
        <table className="w-full border-collapse overflow-hidden rounded-xl shadow-mid shad">
          <thead className="bg-radial from-[#dd9206] via-[#835f1c] to-[#6d581d] drop-shadow-[0_0_12px_rgba(0,0,0,0.5)] text-white font-raleway uppercase text-sm">
            <tr>
              <th className="p-4 text-center">Nombre</th>
              <th className="p-4 text-center">Tipo</th>
              <th className="p-4 text-center">Email</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-center">Creación</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-inter text-sm">
            {dataBoard.results.map((user, index) => (
              <tr
                key={user.user_id}
                className={`border-b-[2.5px] border-[#b9b9b9]  last:border-none ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"
                } hover:bg-[#313131] hover:text-white transition-all`}
              >
                <td className="p-4 ] text-center font-semibold">{user.user_name}</td>
                <td className="p-4 ] text-center ">
                  <span className={`px-3 py-1 items-center text-xs font-bold rounded-full text-white shadow-md ${getUserTypeColor(user.role_id)}`}>
                    {formatUserType(user.role_id)}
                  </span>
                </td>
                <td className="p-4 ] text-center">{user.email}</td>
                <td className="p-4 ] text-center">
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
                <td className="p-4 ] text-center">{formatDate(user.created_at)}</td>
                <td className="p-4 ] text-center">
                  <button
                    onClick={() => handleOpenUserForm(user)}
                    className="text-[#9e824f]  hover:text-[#eeb13f] hover:cursor-pointer transition-all transform hover:scale-120"
                  >
                    <FaEdit size={18} />
                  </button>
                  {/* <button
                    onClick={() => handleOpenUserForm(user)}
                    className="text-amber-400 ml-1 hover:text-amber-800 hover:cursor-pointer transition-all transform hover:scale-120"
                  >
                    <FaRegTrashAlt size={18} />
                  </button> */}
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
