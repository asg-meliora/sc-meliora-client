import React, { useEffect, useState } from 'react';
import SideMenu from '../components/SideMenu';
import FilesTable from '../components/Files/FilesTable';
import Cookies from "js-cookie";

const Files = ({ api }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/clients/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Datos enviados con éxito');
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Error al enviar los datos: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar los datos. Por favor, revisa la consola para más detalles.');
    }
  };

  return (
    <>
      <div className="flex flex-wrap bg-gray-100">
        <SideMenu className="w-full md:w-1/4" />
        <div className="flex-1 w-full md:w-3/4 m-3 flex flex-col items-center ">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Lista de Expedientes
          </h2>
          <div className="bg-gray-50 shadow-xl rounded-lg px-5 py-3 m-2 w-full max-w-6xl overflow-x-auto">
            <FilesTable api={api} />
          </div>

          {/* Modal */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => setIsModalOpen(true)}
          >
            Abrir Modal
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ backgroundColor: 'rgba(75, 87, 99, 0.5)' }}>
              <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h3 className="text-xl font-bold mb-4">Formulario</h3>
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
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Files