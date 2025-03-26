import React, { useState } from "react";
import styles from "../../styles";

const UserForm = ({ initialData = null, onSubmit, setShowForm }) => {
  // Veify if initialData is null, if it is, set the initialData to an object with the following (empty) properties
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      password: "",
      type: 1,
      email: "",
      status: 1,
    }
  );

  // Format the user type to a more readable format from JSON data
  const formatUserType = (type) => {
    const types = {
      1: "Administrador",
      2: "Usuario",
      3: "Broker",
      4: "Lectura",
    };
    return types[type] || "Desconocido";
  };

  /// Handle the change of the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Change logic to send the correct data to the API
    onSubmit(formData);
    setShowForm(false);
  };

  const [errorMessage, seterrorMessage] = useState("");

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
          name="name"
          placeholder="Nombre"
          value={formData.user_name}
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
          name="confirm-password"
          placeholder="Confirmar Contraseña"
          onChange={handleChange}
          className={styles.input_form}
          required
        />

        {initialData && (
          <input
            type="password"
            name="last-password"
            placeholder="Contraseña Anterior"
            onChange={handleChange}
            className={styles.input_form}
            required />
        )}

        {/* TODO: Fix showing correct user type given json info */}
        <select
          name="type"
          value={() => formatUserType(formData.role_id)}
          onChange={handleChange}
          className={`${styles.select_form}`}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
          <option value="broker">Broker</option>
          <option value="lecture">Lectura</option>
        </select>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className={styles.input_form}
          required
        />

        {/* TODO: Fix showing correct user type given json info */}
        <select
          name="status"
          value={formData.is_active}
          onChange={handleChange}
          className={`${styles.select_form}`}
        >
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
