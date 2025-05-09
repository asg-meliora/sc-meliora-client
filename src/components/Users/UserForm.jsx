import React, { useState } from "react";
import styles from "../../styles";

import { FiEye, FiEyeOff } from "react-icons/fi";

import { validateEmail, validatePassword } from "../../validations";

const UserForm = ({
  initialData = null,
  onSubmit,
  toggleForm,
  loading,
  serverErrorMessage,
}) => {
  // Verify if initialData is null, if it is, sets the initialData to an object with the following (empty) properties
  const [formData, setFormData] = useState(
    initialData || {
      user_name: "",
      email: "",
      password_hash: "",
      role_id: "",
      is_active: "",
    }
  );

  

  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(formData.password_hash || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(initialData ? true : false);

  /**
   * Handles the change of input fields, updating formData and checking password match
   * @function handleChange
   * @param {Object} e - Event object from the input field
   * @param {string} e.target.name - Name of the input field
   * @param {string} e.target.value - Value of the input field
   * @returns {void} - Updates formData & validates password match
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password_hash") {
      setFormData((prev) => ({ ...prev, password_hash: value }));
      setPasswordsMatch(value !== "" && value === confirmPassword);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      setPasswordsMatch(value !== "" && value === formData.password_hash);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * Toggles visibility of password or confirm password fields
   * @function togglePasswordVisibility
   * @param {string} field - Field name to toggle visibility for either password or confirm password
   * @returns {void}
   */
  const togglePasswordVisibility = (field) => {
    if (field === "password_hash") setShowPassword(!showPassword);
    else if (field === "confirmPassword")
      setShowConfPassword(!showConfPassword);
  };

  
  /**
   * Handles form submition, validating input fields, then sends data to submit
   * @async
   * @function handleSubmit
   * @param {Object} e - Event object from the form submittion
   * @returns {Promise<void>} - Promise that resolves if form is succesfully submitted
   * @throws {Error} - Sets an error message if validation fails or if submition encouunters an error and shows error message
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // user_name validation
    if (
      (!initialData &&
        (formData.user_name.length < 3 || formData.user_name.length > 20)) ||
      !formData.user_name.length > 20
    ) {
      setErrorMessage(
        "Por favor, introduce un nombre válido. (Mínimo 3 y máximo 20 caracteres)."
      );
      return;
    }
    // Email validation
    // > Empty email
    if (!initialData && !formData.email) {
      setErrorMessage(
        "Por favor, introduce tu dirección de correo electrónico."
      );
      return;
    }
    // > Invalid email format
    else if (!initialData && !validateEmail(formData.email)) {
      setErrorMessage("Por favor, introduce un correo electrónico válido.");
      return;
    }
    // Password validation
    // > Empty password
    if (!initialData && !formData.password_hash && !initialData) {
      setErrorMessage("Por favor, introduce la contraseña.");
      return;
    }
    // > Invalid password format
    else if (!initialData && !validatePassword(formData.password_hash)) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo."
      );
      return;
    }
    // > Invalid password confirmation
    if (!initialData && formData.password_hash !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setErrorMessage("");

    try {
      await onSubmit(formData);
      toggleForm(false);
    } catch (error) {
      setErrorMessage(error.message || "Hubo un error en el servidor. Inténtalo de nuevo.")
    }
  };

  return (
    <div className={styles.form_layout}>
      {/* Close Form Button */}
      <button
        onClick={() => toggleForm(false)}
        className={styles.close_form_button}
      >
        ✕
      </button>

      {/* Form Title */}
      <h2 className={styles.form_heading}>
        {initialData ? "Editar Usuario" : "Agregar Nuevo Usuario"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
        noValidate
      >
        {/* Error Message */}
        {(errorMessage || serverErrorMessage) && (
          <div className={styles.error_message}>
            {errorMessage ? errorMessage : serverErrorMessage}
          </div>
        )}

        <input
          type="text"
          name="user_name"
          placeholder="Usuario"
          value={formData.user_name || ""}
          onChange={handleChange}
          className={styles.input_form}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email || ""}
          onChange={handleChange}
          className={styles.input_form}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password_hash"
            placeholder="Contraseña"
            value={formData.password_hash || ""}
            onChange={handleChange}
            className={styles.input_form}
            required
          />
          <button
            type="button"
            name="passwordButton"
            onClick={() => togglePasswordVisibility("password_hash")}
            className={`${styles.input_icon} hover:cursor-pointer hover:scale-115 focus:outline-none transition-all`}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            value={confirmPassword || ""}
            onChange={handleChange}
            className={`${styles.input_form} focus:outline-none ${
              !passwordsMatch
                ? "border-red-500 border-2 focus:ring-2 focus:ring-red-500"
                : "border-green-600 border-2 focus:ring-2 focus:ring-green-600"
            }`}
            required
          />
          <button
            type="button"
            name="confirmPasswordButton"
            onClick={() => togglePasswordVisibility("confirmPassword")}
            className={`${styles.input_icon} hover:cursor-pointer hover:scale-115 focus:outline-none transition-all`}
          >
            {showConfPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* TODO: Fix showing correct user type given json info */}
        <select
          name="role_id"
          // value={() => formatUserType(formData.role_id)}
          value={formData.role_id || ""}
          onChange={handleChange}
          className={`${styles.select_form} ${
            formData.role_id ? "text-black font-normal" : "italic text-gray-500"
          }`}
        >
          <option value="" hidden disabled>
            Tipo de Usuario
          </option>
          <option value="2">Usuario</option>
          <option value="1">Administrador</option>
          <option value="3">Broker</option>
          <option value="4">Lectura</option>
        </select>

        {/* TODO: Fix showing correct user type given json info */}
        <select
          name="is_active"
          value={formData.is_active !== undefined ? formData.is_active : ""}
          onChange={handleChange}
          className={`${styles.select_form} ${
            formData.is_active !== ""
              ? "text-black font-normal"
              : "italic text-gray-500"
          }`}
        >
          <option value="" hidden disabled>
            Estatus del Usuario
          </option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>

        {/* Add User Button */}
        <button
          type="submit"
          disabled={loading}
          className={styles.send_button}
        >
          {initialData ? "Guardar Cambios" : "Agregar Usuario"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
