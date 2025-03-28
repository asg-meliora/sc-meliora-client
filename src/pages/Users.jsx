import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import { usersData } from "../constants/index";
import UserForm from "../components/Users/UserForm";
import UsersTable from "../components/Users/UsersTable";

const Users = ({api}) => {
  const [users, setUsers] = useState(usersData);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

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
          <UsersTable api={api} handleClickAddUser={handleClickAddUser} />
        </div>
      </div>

      {/* Form Moda; */}
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
