import React, { useState } from "react";
//import { TokenContext } from '../TokenContext';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


const Login = ({ api }) => {
    const [email, setEmail] = useState("");
    const [password_hash, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación personalizada
        if (!email) {
            setErrorMessage("Por favor, introduce tu dirección de correo electrónico.");
            return;
        } else if (!email.includes("@")) {
            setErrorMessage("Por favor, incluye un '@' en la dirección de correo electrónico.");
            return;
        }

        if (!password_hash) {
            setErrorMessage("Por favor, introduce tu contraseña.");
            return;
        }

        // Si todo es válido, limpiar el mensaje de error
        setErrorMessage("");
        // console.log("Email:", email);
        // console.log("Password:", password_hash);
        // Aquí puedes hacer la petición a la API para autenticar


        const values = {
            email: email,
            password_hash: password_hash,
        };
        console.log(values);

        const response = await fetch(`${api}/accesslogin`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

        const data = await response.json();

        console.log(data)

        if (data.error) {
            navigate('/');
        }
        else {
            const expireCookie = 1 / 24;
            Cookies.set('token', data.token, { expires: expireCookie, secure: true, sameSite: 'strict' });
            //Cookies.set('userid', data.userid, { expires: expireCookie, secure: true, sameSite: 'strict' });
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-xl font-bold text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit} noValidate>
                    {errorMessage && (
                        <div className="mb-4 text-red-500">
                            {errorMessage}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Email:
                        </label>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                              required
                          />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Password:
                        </label>
                        <input type="password" value={password_hash} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;