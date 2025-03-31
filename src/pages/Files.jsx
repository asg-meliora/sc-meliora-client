import React, { useEffect, useState } from 'react';
import SideMenu from '../components/SideMenu';
import FilesTable from '../components/Files/FilesTable';
import FilesCreate from '../components/Files/FilesCreate';
import Cookies from "js-cookie";

const Files = ({ api }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); //Estado para manejar el status del modal
  const [newFiles, setNewFiles] = useState({ results:[] }); //Estado para manejar los nuevos datos del formulario


  useEffect(() => {
      const getClients = async () => {
          const response = await fetch(`http://localhost:3001/api/clients/`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': Cookies.get('token')
              }
          })

          const data = await response.json()

          setNewFiles(data)
      }
      getClients()
  }, [api])
    // vacío, se ejecuta cada vez que renderiza el componente
    // [], se ejecuta la primera vez que renderiza el componente
    // [estado], se ejecuta solo cuando se actualice el estado, sin bucle


  // Función para manejar la adición de un nuevo archivo
  const handleNewFile = (newFile) => {
    const updatedResults = Array.isArray(newFile) ? newFile.flat() : [newFile]; // Aplanar el array de resultados, si newFile es un array dentro de results
    setNewFiles((prevFiles) => ({...prevFiles, results: [...prevFiles.results, ...updatedResults] })); // Acceder a prevFiles.results
  };
  
  console.log('Debug Padre',newFiles);
  return (
    <>
      <div className="flex flex-wrap bg-gray-100">
        <SideMenu className="w-full md:w-1/4" />
        <div className="flex-1 w-full md:w-3/4 m-3 flex flex-col items-center ">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Lista de Expedientes
          </h2>
          <div className="bg-gray-50 shadow-xl rounded-lg px-5 py-3 m-2 w-full max-w-7xl overflow-x-auto">
            <FilesTable api={api} newFiles={newFiles} />
          </div>


          {/*Modal*/}
          <div className="Modal">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4 " onClick={() => setIsModalOpen(true)}>
              Crear Nuevo Expediente
            </button>

            <FilesCreate api={api} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddFile={handleNewFile}>
              <h3 className="text-xl font-bold mb-4">Formulario</h3>
            </FilesCreate>
          </div>

        </div>
      </div>
    </>
  )
}

export default Files