import React, { useState } from "react";
//import { TokenContext } from '../TokenContext';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { GiLion } from "react-icons/gi";
import styles from "../styles";
import lionLogo from "../assets/lion.webp";

const Login = ({ api }) => {
  const [email, setEmail] = useState("");
  const [password_hash, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Reset error message
    setErrorMessage("");
    // console.log("Email:", email);
    // console.log("Password:", password_hash);

    const values = {
      email: email,
      password_hash: password_hash,
    };
    // console.log(values);

    const response = await fetch(`${api}/accesslogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    console.log(data);

    if (data.error) {
      navigate("/");
    } else {
      const expireCookie = 1 / 24;
      Cookies.set("token", data.token, {
        expires: expireCookie,
        secure: true,
        sameSite: "strict",
      });
      //Cookies.set('userid', data.userid, { expires: expireCookie, secure: true, sameSite: 'strict' });
      navigate("/dashboard");
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
          <span className="text-gray-800 font-semibold text-xl">
            Black Lion
          </span>
        </div>

        {/* Login */}
        {/* Title & text */}
        <div className="bg-radial from-[#ffffff] via-[#f0f0f0] to-[#dbdbdb] p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-1">
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
            <div className="mb-4">
              <label className={`${styles.input_label}`}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.input_field}`}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className={`${styles.input_label}`}>Contraseña</label>
              <input
                type="password"
                value={password_hash}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input_field}`}
                required
              />
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
