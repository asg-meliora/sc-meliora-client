import React, { useState, useEffect, useCallback } from "react";
import SideMenu from "../components/SideMenu";
import UserForm from "../components/Users/UserForm";
import UsersTable from "../components/Users/UsersTable";
import Cookies from "js-cookie";


const Users = ({api}) => {
  // const [users, setUsers] = useState(usersData);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false); // State for activating/deactivating send form button
  const [dataBoard, setUsersBoard] = useState({ results: [] });

  /**
   * @param {object} user - User object to be edited or null if adding a new user
   *  @returns {void} - Set the editingUser state to the user object and show the form
   */
  const handleOpenUserForm = (user = null) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const fetchUsers = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado. Por favor, inicia sesión.");
      return;
    }
    
    try {
      const response = await fetch(`${api}/users` , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        },
      });
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsersBoard(data);
    } catch (error) {
      console.log("Error al obtener usuarios:", error);
    }
  }, [api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  console.log(dataBoard);

  /**
   * Function to handle the form submission
   * @param {Object} formData - Form data to be sent to the API
   * @returns {Promise<void>} - Promise that resolves when the form is submitted 
   * @throws {Error} - Throws an error if the form submission fails
   */
  const handleUserSubmit = async (formData) => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado. Por favor, inicia sesión.");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Data\n", formData);
      
      const response = await fetch(`${api}/accesslog`, {
        method: editingUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error al enviar el formulario");
      await response.json();
      console.log(response.data);
      await fetchUsers();
      setShowForm(false);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Closes the form modal and resets the editingUser state
   * @returns {void}
   */
  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
  }

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
                onClick={() => handleOpenUserForm()}
                className="bg-gold-gradient menuButton hover:cursor-pointer text-gray-950 hover:text-white font-lora font-medium px-4 py-2 rounded-lg hover:scale-105 transform transition-all"
              >
                + Agregar Usuario
              </button>
            </div>
          </div>
          <UsersTable api={api} dataBoard={dataBoard} handleOpenUserForm={handleOpenUserForm} />
        </div>
      </div>

      {/* Form Moda; */}
      {showForm && (
        <div className="fixed top-0 right-0 w-full h-full flex justify-center items-center">
          <div className="fixed w-full h-full bg-black opacity-50"></div>
          <UserForm
            onSubmit={handleUserSubmit}
            toggleForm={closeForm}
            loading={loading}
            initialData={editingUser}
          />
        </div>
      )}
    </>
  );
};

export default Users;
