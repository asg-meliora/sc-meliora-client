import React, { useState, useEffect } from "react";
import styles from "../../styles";

const UserForm = ({ initialData = null, onSubmit, setShowForm }) => {
  // Veify if initialData is null, if it is, set the initialData to an object with the following (empty) properties
  const [formData, setFormData] = useState(
    initialData || {
      user_name: "",
      email: "",
      password: "",
      role_id: "",
      is_active: "",
    }
  );

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [errorMessage, setErrorMessage] = useState("");

  // Format the user role_id to a more readable format from JSON data
  const formatUserType = (role_id) => {
    const types = {
      1: "Administrador",
      2: "Usuario",
      3: "Broker",
      4: "Lectura",
    };
    return types[role_id] || "Desconocido";
  };

  /// Handle the change of the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // !
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Change logic to send the correct data to the API

    // user_name validation
    if (
      (!initialData && !formData.user_name && !formData.user_name.length < 3) ||
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
    if (!initialData && !formData.password && !initialData) {
      setErrorMessage("Por favor, introduce la contraseña.");
      return;
    }
    // > Invalid password format
    else if (!initialData && !passwordRegex.test(formData.password)) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayuscula, un número y un símbolo."
      );
      return;
    }
    // > Invalid password confirmation
    if (!initialData && formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    onSubmit(formData);
    setShowForm(false);
  };

  return (
    <div className="max-w-md mx-auto bg-radial from-[#ffffff] via-[#f0f0f0] to-[#dfdfdf] text-black p-6 rounded-lg shadow-xl relative w-96">
      {/* Close Form Button */}
      <button
        onClick={() => setShowForm(false)}
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
        {errorMessage && (
          <div className="mb-4 text-red-500 text-sm text-center animate-fade-in">
            {errorMessage}
          </div>
        )}

        <input
          type="text"
          name="user_name"
          placeholder="Usuario"
          // value={formData.user_name}
          onChange={handleChange}
          className={styles.input_form}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          // value={formData.email}
          onChange={handleChange}
          className={styles.input_form}
          required
        />

        {/* TODO: Get unhashed password or definde way of handling edit password */}
        {/* TODO: Confirm Password check icon if match, if not x icon */}
        {/* TODO: Validation if user wrote new password for validating last password */}
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className={styles.input_form}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          onChange={handleChange}
          className={styles.input_form}
          required
        />

        {/* {initialData && (
          <input
            type="password"
            name="last-password"
            placeholder="Contraseña Anterior"
            onChange={handleChange}
            className={styles.input_form}
            required
          />
        )} */}

        {/* TODO: Fix showing correct user type given json info */}
        <select
          name="role_id"
          // value={() => formatUserType(formData.role_id)}
          value={formData.role_id || ""}
          onChange={handleChange}
          className={`${styles.select_form} ${formData.role_id ? "text-black font-normal" : "italic text-gray-500"}`}
        >
          <option value="" hidden disabled>Tipo de Usuario</option>
          <option value="1">Usuario</option>
          <option value="2">Administrador</option>
          <option value="3">Broker</option>
          <option value="4">Lectura</option>
        </select>

        {/* TODO: Fix showing correct user type given json info */}
        <select
          name="is_active"
          value={formData.is_active || ""}
          onChange={handleChange}
          className={`${styles.select_form} ${formData.is_active ? "text-black font-normal" : "italic text-gray-500"}`}
        >
          <option value="" hidden disabled>Estatus del Usuario</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>

        {/* Add User Button */}
        <button
          type="submit"
          className="bg-blue-gradient formButton p-2 mt-2 rounded-lg hover:cursor-pointer text-white hover:text-gray-200 text-lg w-65 self-center font-semibold hover:scale-110 transform transition-all"
        >
          {initialData ? "Guardar Cambios" : "Agregar Usuario"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
