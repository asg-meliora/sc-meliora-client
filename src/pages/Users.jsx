import React, { useState, useEffect, useCallback } from "react";
import SideMenu from "../components/SideMenu";
import UserForm from "../components/Users/UserForm";
import UsersTable from "../components/Users/UsersTable";
import { FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";

import styles from "../styles";

const Users = ({ api }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false); // State for activating/deactivating send form button
  const [dataBoard, setUsersBoard] = useState({ results: [] });

  const url = editingUser ? `${api}/users/update` : `${api}/accesslog`;

  /**
   * Opens the user form for creating or editing a user
   * @function handleOpenUserForm
   * @param {object|null} user - User object to be edited or null if adding a new user
   *  @returns {void} - Set the editingUser state to the user object and show the form
   */
  const handleOpenUserForm = (user = null) => {
    setEditingUser(user);
    setShowForm(true);
  };

  /**
   * Function that fetches the list of users from the server and updates the user board state
   * @async
   * @function fetchUsers
   * @returns {Promise<void>} Promise that resolves when users are fetched correctly & its state changes
   * @throws {Error} Throws error if the request fails
   */
  const fetchUsers = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await fetch(`${api}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsersBoard(data);
    } catch (error) {
      // TODO: Set error message to show fail in fetching or other way
      console.log("Error al obtener usuarios:", error);
    }
  }, [api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // console.log(dataBoard);

  /**
   * Async Function that handles the form submission to create or update a user
   * @async
   * @function handleUserSubmit
   * @param {Object} formData - Form data to be sent to the API
   * @returns {Promise<void>} - Promise that resolves when the form is submitted
   * @throws {Error} - Throws an error if the form submission fails or if the token is not found
   */
  const handleUserSubmit = async (formData) => {
    console.warn("Data\n", formData);
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado. Por favor, inicia sesión.");
      return Promise.reject(
        new Error("Token no encontrado. Por favor, inicia sesión")
      );
    }

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: editingUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar el formulario");
      }

      await response.json();
      await fetchUsers();
      setShowForm(false);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Closes the form modal and resets the editingUser state
   * @function closeForm
   * @returns {void} - Closes form and sets editingUser to null
   */
  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <>
      <div className={styles.blank_page}>
        <div className="w-64">
          <SideMenu />
        </div>

        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <h2 className={styles.heading_page}>Usuarios</h2>
            <div className={styles.button_header_container}>
              <button
                onClick={() => handleOpenUserForm()}
                //button_header
                className={styles.button_header}
              >
                <FaPlus /> Agregar Usuario
              </button>
            </div>
          </div>
          <UsersTable
            api={api}
            dataBoard={dataBoard}
            handleOpenUserForm={handleOpenUserForm}
          />
        </div>
      </div>

      {/* Form Moda; */}
      {showForm && (
        <div className={styles.form_container}>
          <div className={styles.form_modal_bg}></div>
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
