import React, { useState } from "react";
//import { TokenContext } from '../TokenContext';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import styles from "../styles";
import lionLogo from "../assets/lion.webp";
import { FiEye, FiEyeOff, FiMail } from "react-icons/fi";

const Login = ({ api }) => {
  const [email, setEmail] = useState("");
  const [password_hash, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Toggles visibility of the password field
   * @function togglePasswordVisibility
   * @returns {void} - Sets password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Handles form submittion for user login, validating inputs and sending data to server
   * @async
   * @function handleSubmit
   * @param {Object} e - The event object of the form submittion
   * @returns {Promise<void>} - A promise that resolves when login process is complete
   * @throws {Error} - Sets error message if validation fails or if an error occurs in server
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!email) {
      setErrorMessage(
        "Por favor, introduce tu dirección de correo electrónico."
      );
      return;
    } else if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, introduce un correo electrónico válido.");
      return;
    }

    // Password validation
    if (!password_hash) {
      setErrorMessage("Por favor, introduce tu contraseña.");
      return;
    }

    setErrorMessage("");

    const values = {
      email: email,
      password_hash: password_hash,
    };

    const response = await fetch(`${api}/accesslogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();


    if (data.error) {
      setErrorMessage(data.error)
    } else {
      const expireCookie = 1 / 24; // el token expira en 1 hora

      // Guardar el token y el role_id en las cookies
      Cookies.set("token", data.token, {
        expires: expireCookie,
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("role_id", data.role_id, {
        expires: expireCookie,
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("is_active", data.is_active, {
        expires: expireCookie,
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("user_id", data.user_id, {
        expires: expireCookie,
        secure: true,
        sameSite: "strict",
      }); 
  
      // Redirección según role_id
      if (data.role_id === 1) {
        navigate("/dashboard"); // Vista de administrador
      }
      else if (data.role_id === 2) {
        navigate(`/user/invoices/${data.user_id}`); // Vista de usuario
      }
      else {
        navigate("*"); // Vista por defecto o común
      }
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-200 via-gray-400 to-gray-200 items-center justify-center relative">
        {/* Top Left Logo */}
        <div className="absolute top-6 left-8 flex items-center space-x-1">
          <img
            src={lionLogo}
            alt="lion-logo"
            className="w-[70px] h-[70px] mr-[-5px]"
          />
          <span className="text-gray-800 font-semibold font-raleway text-2xl">
            Black Lion
          </span>
        </div>

        {/* Login */}
        {/* Title & text */}
        <div className="bg-radial from-[#ffffff] via-[#f0f0f0] to-[#dbdbdb] p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-4xl font-bold text-center text-blackN mb-1">
            Bienvenido
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Por favor ingresa tus credenciales
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {errorMessage && (
              <div className="mb-4 text-red-500 text-sm text-center animate-fade-in">
                {errorMessage}
              </div>
            )}

            {/* Email Input */}
            <div className="mb-4 relative">
              <label className={`${styles.input_label}`}>Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${styles.input_field}`}
                  required
                />
                <FiMail className={`${styles.input_icon}`} />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4 relative">
              <label className={`${styles.input_label}`}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password_hash}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.input_field}`}
                  required
                />
                <button type="button" onClick={togglePasswordVisibility} className={`${styles.input_icon} hover:cursor-pointer hover:scale-115 focus:outline-none transition-all`}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="flex justify-center items-center mt-6">
              <button
                type="submit"
                className="w-[85%] h-12 formButton text-white font-inter text-xl py-2 rounded-lg hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
