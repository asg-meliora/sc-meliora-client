import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { FaEdit } from "react-icons/fa";

const UsersTable = ({ api, handleClickAddUser }) => {
  const [dataBoard, setDataBoard] = useState({ results: [] });

  useEffect(() => {
    const getBoards = async () => {
      const response = await fetch(`${api}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });

      const data = await response.json();

      setDataBoard(data);
    };
    getBoards();
  }, [api]);

  console.log(dataBoard);

  const formatUserType = (type) => {
    const types = {
      1: "Administrador",
      2: "Usuario",
      3: "Broker",
      4: "Lectura",
    };
    return types[type] || "Desconocido";
  };

  return (
    <div className="px-2 w-full mt-0.5">
      <div className="overflow-x-auto bg-whiteN p-4">
        <table className="w-full border-collapse overflow-hidden rounded-xl">
          <thead className="bg-gradient-to-r from-yellow-600 to-amber-900 text-white font-raleway uppercase text-sm">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-inter text-sm">
            {dataBoard.results.map((user, index) => (
              <tr
                key={user.user_id}
                className={`border-b border-gray-300 last:border-none ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-200"
                } hover:bg-gray-300 transition-all`}
              >
                <td className="p-4 capitalize">{user.user_name}</td>
                <td className="p-4">{formatUserType(user.role_id)}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
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
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleClickAddUser(user)}
                    className="text-amber-400 hover:text-amber-800 hover:cursor-pointer transition-all transform hover:scale-120"
                  >
                    <FaEdit size={18} />
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
