import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";

//Diccionario para los labels del formulario
const DiccLabels = {
  "name_rs": { label: "Razón Social" },
  "rfc": { label: "RFC" },
  "curp": { label: "CURP" },
  "address": { label: "Dirección" },
  "zip_code": { label: "Código Postal" },
  "phone": { label: "Teléfono" },
  "email": { label: "Correo Electrónico" },
  "bank_account": { label: "No. Cuenta Bancaria" },
  "fileCSF": { label: "CSF" },
  "fileCDB": { label: "Comprabante de Domicilio" },
  "fileCDD": { label: "Carátula Bancaria" },
};

const TextInput = ({ label, name, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-gray-700 capitalize">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded"
      required
    />
  </div>
);

const UserAssignInput = ({ options, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 capitalize">Usuario Asignado</label>
    <select
      name="userAssign"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded"
      required
    >
      <option value="">Seleccione una opción</option>
      {options.map(({ user_id, user_name }) => (
        <option key={user_id} value={user_name}>{user_name}</option>
      ))}
    </select>
  </div>
);

const FileInput = ({ name, onChange, file, label }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700"> Subir archivo {label}</label>
    <input
      id={name}
      type="file"
      name={name}
      onChange={onChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      accept="application/pdf, .pdf"
      required
    />
    {file && <p className="mt-2 text-sm text-gray-600">Archivo Seleccionado: {file.name}</p>}
  </div>
);

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
    userAssign: '',
    fileCSF: null,
    fileCDB: null,
    fileCDD: null,
  });

  const [userAssigns, setuserAssigns] = useState({ results: [] });

  useEffect(() => {
    const fetchUsers = async (api) => {
      const response = await fetch(`${api}/users/byregnact`, {
        method: 'GET',
        headers: { "x-access-token": Cookies.get("token") }
      });
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setuserAssigns(data);

    };
    fetchUsers(api)
  }, [api]);

  console.log(formData); //QUITARLO

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    console.log("Contenido de FormData:");
    for (let pair of data.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    try {
      const response = await fetch(`${api}/clients/complete`, {
        method: "POST",
        headers: { "x-access-token": Cookies.get("token") },
        body: data,
      });

      console.log(response);
      if (!response.ok) throw new Error("Error al crear el cliente");

      const result = await response.json();
      if (result.client_id) {
        const clientResponse = await fetch(`${api}/clients/byid/${result.client_id}`, {
          headers: { "x-access-token": Cookies.get("token") },
        });
        if (!clientResponse.ok) throw new Error("Error al obtener los datos del cliente");
        const newClient = await clientResponse.json();
        onAddFile(newClient.results);
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ backgroundColor: 'rgba(75, 87, 99, 0.5)' }}>
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        {children}
        <form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            key.startsWith('file')
              ? <FileInput key={key} name={key} file={value} onChange={handleFileChange} label={DiccLabels[key].label}/>
              : key !== 'userAssign' && <TextInput key={key} label={DiccLabels[key].label} name={key} value={value} onChange={handleInputChange} />
          ))}
          <UserAssignInput options={userAssigns.results} value={formData.userAssign} onChange={handleInputChange}/>
          <div className="flex justify-end mt-4">
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={onClose}>Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FilesCreate;
