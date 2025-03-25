import React, { useState } from "react";
import styles from "../../styles";

const UserForm = ({ initialData = null, onSubmit, setShowForm }) => {
  // Veify if initialData is null, if it is, set the initialData to an object with the following (empty) properties
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      password: "",
      type: "user",
      email: "",
      phone: "",
      status: "active",
    }
  );

  /// Handle the change of the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setShowForm(false);
  };

  return (
    <div className="max-w-md mx-auto bg-whiteN text-black p-6 rounded-lg shadow-xl relative w-96">
      {/* Close Form Button */}
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 hover:font-bold text-2xl mx-2 my-1 hover:cursor-pointer hover:scale-120 transition-all"
      >
        ✕
      </button>

      {/* Form Title */}
      <h2 className="text-2xl font-bold mb-4 mx-2 font-raleway">
        {initialData ? "Editar Usuario" : "Agregar Nuevo Usuario"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-2">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`${styles.input} hover:cursor-pointer`}
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
          className={styles.input}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={`${styles.input} hover:cursor-pointer`}
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
