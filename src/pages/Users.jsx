import React, { useState, useEffect, useCallback, use } from "react";
import UserForm from "../components/Users/UserForm";
import UsersTable from "../components/Users/UsersTable";
import { FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";
import SuccessToast from "../components/SuccessToast";
import LoadingScreen from "../components/LoadingScreen";
import { AnimatePresence } from "framer-motion";

import styles from "../styles";
import Navbar from "../components/Navbar";
import { SuccessTexts } from "../constants/Texts";
import { MdMenu } from "react-icons/md";
import SideMenu from "../components/SideMenu";
import ConfirmUserDeletion from "../components/Users/ConfirmUserDeletion"

const Users = ({ api }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true); // State for activating/deactivating send form button
  const [loadingMessage, setLoadingMessage] = useState("Cargando usuarios...");
  const [dataBoard, setUsersBoard] = useState({ results: [] });
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSidemenu, setShowSideMenu] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);

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
      setError("Token no encontrado. Por favor, inicia sesión.");
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
      setError(error.message);
      console.log("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
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
      setError("Token no encontrado. Por favor, inicia sesión.");
      return Promise.reject(
        new Error("Token no encontrado. Por favor, inicia sesión")
      );
    }
    setLoadingMessage("Enviando información...");
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
      setSuccessMessage(
        editingUser ? SuccessTexts.userModify : SuccessTexts.userCreate
      );
      setSuccess(true);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setError(error.message);
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

  const handleUserDeletion = async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado. Por favor, inicia sesión.");
      setError("Token no encontrado. Por favor, inicia sesión.");
      return;
    }
    setLoadingMessage("Eliminando usuario...");
    setLoading(true);

    try {
      const response = await fetch(`${api}/users/notavailable/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el usuario");

      await response.json();
      await fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setSuccessMessage(SuccessTexts.userDelete);
      setSuccess(true);
    }
  };

  const handleOpenUserDelete = (userId) => {
    setUserId(userId);
    setShowModal(true);
  };

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen message={loadingMessage} />}
      </AnimatePresence>
      <div className={styles.blank_page}>
        <Navbar />
        {showSidemenu && <SideMenu setFullSideBar={setShowSideMenu} />}
        <div className={styles.page_container}>
          <div className={styles.header_container}>
            <div className="inline pt-5.5 sm:hidden text-white">
              <div>
                <button
                  onClick={() => setShowSideMenu(true)}
                  className="mt-auto mb-6 p-2 text-3xl rounded-lg hover:cursor-pointer hover:scale-115 transform transition-all"
                >
                  <MdMenu />
                </button>
              </div>
            </div>
            <h2 className={styles.heading_page}>Usuarios</h2>
            <div className={styles.button_header_container}>
              <button
                onClick={() => handleOpenUserForm()}
                //button_header
                className={styles.button_header}
              >
                <FaPlus />{" "}
                <span className="hidden sm:inline-block">Agregar Usuario</span>
              </button>
            </div>
          </div>
          <UsersTable
            api={api}
            dataBoard={dataBoard}
            handleOpenUserForm={handleOpenUserForm}
            handleOpenUserDelete={handleOpenUserDelete}
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
      {showModal && (
        <div className={styles.form_container}>
          <div className={styles.form_modal_bg}></div>
          <ConfirmUserDeletion
            setShowModal={setShowModal}
            handleUserDeletion={handleUserDeletion}
          />
        </div>
      )}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {success && (
            <SuccessToast
              message={successMessage}
              onClose={() => setSuccess(false)}
              variant="x"
            />
          )}
          {error && (
            <SuccessToast
              message={error}
              onClose={() => setError(null)}
              variant="x"
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Users;
