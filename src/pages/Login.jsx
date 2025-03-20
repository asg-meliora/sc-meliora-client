import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usersData } from "../constants";

import { FaUserAlt, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ error: false, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError({ error: true, message: "Por favor, llene todos los campos" });
      return;
    }

    if (
      usersData.filter(
        (user) =>
          user.name === username &&
          user.password === password /*&&*/
          // user.type === "admin"
      ).length === 0
    ) {
      setError({ error: true, message: "Usuario no encontrado" });
      return;
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-center text-2xl font-bold mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 input-box">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="username"
            >
              Usuario:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
            <FaUserAlt />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
            <FaLock />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 hover:cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
      {error.error && (
        <div className="bg-red-500 text-white p-2 rounded mt-4 text-center" onClick={() => setError({ error: false, message: "" })}>
          {error.message}
        </div>
      )}
    </div>
  );
};

export default Login;
