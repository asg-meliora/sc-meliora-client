import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import { FaEdit } from "react-icons/fa";
import { usersData } from "../constants/index";
import UserForm from "../components/UserForm";

const Users = () => {
  const [users, setUsers] = useState(usersData);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const formatUserType = (type) => {
    const types = {
      user: "Usuario",
      admin: "Administrador",
      broker: "Broker",
      lecture: "Lectura",
    };
    return types[type] || "Desconocido";
  };

  const handleClickAddUser = (user = null) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSubmitUser = (userData) => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...userData } : user
        )
      );
    } else {
      setUsers([...users, { id: users.length + 1, ...userData }]);
    }

    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <>
      <div className="flex bg-whiteN">
        <SideMenu />
        <div className="w-full">
          <div className="flex items-center justify-between bg-black-gradient px-6 py-1">
            <h2 className="text-4xl font-cinzel font-medium heading-gradient">
              Usuarios
            </h2>
            <div className="flex flex-col justify-end my-4">
              <button
                onClick={() => handleClickAddUser()}
                className="bg-gold-gradient menuButton hover:cursor-pointer text-gray-950 hover:text-white font-lora font-medium px-4 py-2 rounded-lg hover:scale-105 transform transition-all"
              >
                + Agregar Usuario
              </button>
            </div>
          </div>

          <div className="px-2 w-full mt-0.5">
            <div className="overflow-x-auto bg-whiteN p-4">
              <table className="w-full border-collapse overflow-hidden rounded-xl">
                <thead className="bg-gradient-to-r from-yellow-600 to-amber-900 text-white font-raleway uppercase text-sm">
                  <tr>
                    <th className="p-4 text-left">Nombre</th>
                    <th className="p-4 text-left">Tipo</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Teléfono</th>
                    <th className="p-4 text-left">Estado</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 font-inter text-sm">
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-300 last:border-none ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-200"
                      } hover:bg-gray-300 transition-all`}
                    >
                      <td className="p-4 capitalize">{user.name}</td>
                      <td className="p-4">{formatUserType(user.type)}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.phone}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full text-white shadow-md ${
                            user.status === "active"
                              ? "bg-green-500 shadow-green-500/50"
                              : "bg-gray-500 shadow-gray-500/50 shadow-lg"
                          }`}
                        >
                          {user.status === "active" ? "Activo" : "Inactivo"}
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
        </div>
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <div className="fixed top-0 right-0 w-full h-full flex justify-center items-center">
          <div className="fixed w-full h-full bg-black opacity-50"></div>
          <UserForm
            onSubmit={handleSubmitUser}
            setShowForm={setShowForm}
            initialData={editingUser}
          />
        </div>
      )}
    </>
  );
};

export default Users;
