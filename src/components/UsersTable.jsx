import React, { useEffect, useState } from 'react';
import './UsersTable.css';
import Cookies from 'js-cookie';

function UsersTable({api}) {
    const [dataBoard, setDataBoard] = useState({ results: [] }); //Variable para obtener los datos del workspace en un hook

    useEffect(() => {
      const getBoards = async () => {
        const response = await fetch(`${api}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token')
          }
        })
  
        const data = await response.json()
  
        setDataBoard(data)
      }
      getBoards()
    }, [api])
    // vacío, se ejecuta cada vez que renderiza el componente
    // [], se ejecuta la primera vez que renderiza el componente
    // [estado], se ejecuta solo cuando se actualice el estado, sin bucle
  
    console.log(dataBoard);

    const roleNames = {
        1: 'Admin',
        2: 'Regular',
        // Agrega más roles aquí si es necesario
    };

    return (
        <table className="cont min-w-full">
            <thead className="navbar">
                <tr>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Rol</th>
                    <th className="px-4 py-2">Estado</th>
                </tr>
            </thead>
            <tbody>
                {dataBoard.results.map(results => (
                    <tr className="navbar" key={results.user_id}>
                        <td className="px-4 py-2">{results.user_name}</td>
                        <td className="px-4 py-2">{results.email}</td>
                        <td className="px-4 py-2">{roleNames[results.role_id] || 'Desconocido'}</td>
                        <td className="px-4 py-2">{results.is_active === 1 ? 'Activo' : results.is_active === 0 ? 'Inactivo' : 'Desconocido'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default UsersTable