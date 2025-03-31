import React, { useState } from 'react';
import Cookies from "js-cookie";

function FilesCreate({ api, isOpen, onClose, children, onAddFile }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name_rs: '',
    rfc: '',
    curp: '',
    address: '',
    zip_code: '',
    phone: '',
    email: '',
    bank_account: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  //TODO Cambiar estructura por nuevo enpoint
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${api}/clients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Debug 3.1',data);

        if (data.results.insertId) {
          // Hacer una segunda solicitud para obtener los datos completos del cliente
          const clientResponse = await fetch(
            `${api}/clients/${data.results.insertId}`,
            {
              headers: { "x-access-token": Cookies.get("token") },
            }
          );

          if (clientResponse.ok) {
            const newClient = await clientResponse.json();
            console.log('Debug 3.2',newClient.results);
            onAddFile(newClient.results); // Agregar el nuevo cliente a la tabla
            onClose(); // Cerrar el modal
          } else {
            alert("Error al obtener los datos del cliente.");
          }
        }
      } else {
        alert("Error al crear el cliente.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ backgroundColor: 'rgba(75, 87, 99, 0.5)' }}>
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        {children}
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div className="mb-4" key={key}>
              <label className="block text-gray-700 capitalize">{key.replace('_', ' ')}</label>
              <input
                type={key === 'email' ? 'email' : 'text'}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FilesCreate;