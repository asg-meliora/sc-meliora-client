import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideMenu from '../../components/SideMenu';
import Cookies from "js-cookie";
import { SiGoogledocs } from "react-icons/si";
import FilesTableDetail from './FileTableDetail.jsx';

import LoadingScreen from '../LoadingScreen.jsx';

function FileDetail({ api }) {
    const { id } = useParams();
    const [fileUrl, setFileUrl] = useState({ urls: [] });
    const [newFiles, setNewFiles] = useState({ results: [] }); //Estado para manejar los nuevos datos del formulario
    const [error, setError] = useState(null); // Estado de error   
    const [loading, setLoading] = useState(true); // Estado de carga

    //Peticion para ver los datos del expediente
    useEffect(() => {
        const getClients = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${api}/clients/byclientanduser/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': Cookies.get('token')
                    }
                });

                if (!response.ok) throw new Error("Error al obtener Expediente");

                const data = await response.json();
                setNewFiles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Carga finalizada
            }
        };

        getClients();
    }, [api, id]);

    useEffect(() => {
        const getFileDetail = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${api}/docs/byid/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': Cookies.get('token')
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener el Documento');
                }

                // const blob = await response.blob(); // Para Manejo De Archivos Pesados
                // const url = URL.createObjectURL(blob);

                const res = await response.json();
                console.log(res);

                setFileUrl(res);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Carga finalizada
            }
        };

        getFileDetail();
    }, [api, id]);  

    // Pantalla de carga
    if (loading) {
        return <LoadingScreen />
    }
    // Manejo de errores
    // if (error) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <p className="text-red-500 text-xl font-semibold">{error}</p>
    //         </div>
    //     );
    // }

    console.log(newFiles);//Quitarlo

    const FormattedDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
        return formattedDate;
    };

    const documentTypeMap = {
        CSF: 'CSF',
        CDD: 'Comprobante Domicilio',
        CDB: 'Caratula Bancaria',
    };

    return (
        <div className="flex flex-wrap bg-gray-100">
            <SideMenu className="w-full md:w-1/4" />
            <div className="flex-1 w-full md:w-3/4 m-3 flex flex-col items-center">

                <h1 className='text-2xl font-bold mb-4 text-center'>
                    Expediente No. {id}
                </h1>

                {/*Detalles del expediente*/}
                <div className="w-full">
                    <FilesTableDetail data={newFiles} />
                </div>


                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className='flex bg-blue-500 rounded-lg my-25 py-10 px-5 gap-10'>
                    {fileUrl.urls.map((urls) => (
                        <a
                        key={urls.document_id}
                        href={urls.signedUrl}
                        download={`${urls.document_type}-${id}`}
                        // className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                        >
                                <div className="cursor-pointer flex flex-col items-center justify-center w-62 h-52 bg-gray-200 rounded-lg">
                                    <SiGoogledocs className="w-26 h-26 my-4" />
                                    <p className="">{documentTypeMap[urls.document_type] || urls.document_type}</p>
                                    <p>({FormattedDate(urls.created_at)})</p>
                                </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FileDetail;