import React, { useState } from "react";
import styles from "../../styles";

import { FiEye, FiEyeOff } from "react-icons/fi";

const UserForm = ({
  initialData = null,
  onSubmit,
  toggleForm,
  loading,
  serverErrorMessage,
}) => {
  // Veify if initialData is null, if it is, set the initialData to an object with the following (empty) properties
  const [formData, setFormData] = useState(
    initialData || {
      user_name: "",
      email: "",
      password_hash: "",
      role_id: "",
      is_active: "",
    }
  );

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(
    formData.password_hash || ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(initialData ? true : false);

  /// Handle the change of the input fields
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

  const togglePasswordVisibility = (field) => {
    if (field === "password_hash") setShowPassword(!showPassword);
    else if (field === "confirmPassword")
      setShowConfPassword(!showConfPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // user_name validation
    if (
      (!initialData &&
        (formData.user_name.length < 3 || formData.user_name.length > 20)) ||
      !formData.user_name.length > 20
    ) {
      setErrorMessage(
        "Por favor, introduce un nombre valido. (Mínimo 3 y máximo 20 caracteres)"
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
    else if (!initialData && !emailRegex.test(formData.email)) {
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
    else if (!initialData && !passwordRegex.test(formData.password_hash)) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayuscula, un número y un símbolo."
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
    <div className="max-w-md mx-auto bg-radial from-[#ffffff] via-[#f0f0f0] to-[#dfdfdf] text-black p-6 rounded-lg shadow-xl relative w-96">
      {/* Close Form Button */}
      <button
        onClick={() => toggleForm(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 hover:font-extrabold text-xl mx-2 my-1 hover:cursor-pointer hover:scale-120 transition-all"
      >
        ✕
      </button>

      {/* Form Title */}
      <h2 className="text-2xl font-bold mb-4 mx-3 text-blackN font-raleway">
        {initialData ? "Editar Usuario" : "Agregar Nuevo Usuario"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mx-2"
        noValidate
      >
        {/* Error Message */}
        {(errorMessage || serverErrorMessage) && (
          <div className="mb-4 text-red-500 text-sm text-center animate-fade-in">
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

        {/* TODO: Get unhashed password or definde way of handling edit password */}
        {/* TODO: Confirm Password check icon if match, if not x icon */}
        {/* TODO: Validation if user wrote new password for validating last password */}

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
          className="bg-blue-gradient formButton p-2 mt-2 rounded-lg hover:cursor-pointer text-white hover:text-gray-200 text-lg w-65 self-center font-semibold hover:scale-110 transform transition-all"
        >
          {initialData ? "Guardar Cambios" : "Agregar Usuario"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
