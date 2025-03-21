import React from "react";
import SideMenu from "../components/SideMenu";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
import { usersData } from "../constants/index";

import styles from "../styles";

const Users = () => {
  const [users, setUsers] = useState(usersData);

  const formatUserType = (type) => {
    const types = {
      user: "Usuario",
      admin: "Administrador",
      broker: "Broker",
      lecture: "Lectura",
    };
    return types[type] || "Desconocido";
  };

  const handleClickAddUser = () => {};

  return (
    <>
      <div className="flex bg-whiteN">
        <SideMenu />
        <div className="w-full">
          <div className="flex items-center justify-between bg-black-gradient px-6 py-4">
            <h2 className="text-3xl font-cinzel font-semibold heading-gradient">
              Usuarios
            </h2>
            {/* <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src="/ruta-a-imagen.jpg"
                alt="Usuario"
                className="w-full h-full object-cover"
              />
            </div> */}
          </div>

          <div className=" text-white px-6 w-full">
            {/* Heading */}
            {/* <h1 className={styles.heading}>
            USUARIOS
          </h1>
          <div className="division-gradient py-1 rounded-2xl mt-3 h-[2px]"></div> */}

            {/* Add User Button */}
            <div className="flex justify-end my-4">
              <button
                onClick={handleClickAddUser}
                className="bg-gold-gradient menuButton hover:cursor-pointer text-white font-lora font-medium px-4 py-2 rounded-lg"
              >
                + Agregar Usuario
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-low rounded-lg">
              <table className="w-full border-collaps overflow-hidden">
                <thead className="bg-dark-gold-gradient font-raleway">
                  <tr>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Tipo</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Teléfono</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b text-black border-gray-300"
                    >
                      <td className="p-3 capitalize">{user.name}</td>
                      <td className="p-3">{formatUserType(user.type)}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.phone}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${
                            user.status === "active"
                              ? "bg-green-600"
                              : "bg-gray-500"
                          }`}
                        >
                          {user.status === "active" ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button className="text-amber-400 hover:text-amber-800">
                          <FaEdit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
