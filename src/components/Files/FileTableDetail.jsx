import React, { useState } from 'react'
import styles from "../../styles";

const FormattedDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

    return formattedDate;
};

function FileTableDetail({ data, onSave, userAssigns }) {
    const DiccHead = {
        name_rs: { label: "Razón Social" },
        rfc: { label: "RFC" },
        curp: { label: "CURP" },
        address: { label: "Dirección" },
        zip_code: { label: "Código Postal" },
        phone: { label: "Teléfono" },
        email: { label: "Correo Electrónico" },
        bank_account: { label: "No. Cuenta Bancaria" },
        created_at: { label: "Fecha de creación" },
        user_name: { label: "Usuario Asignado" },
    };

    if (!data || !data.results || data.results.length === 0) {
        return <div className="text-red-500">No hay datos para mostrar.</div>;
    }

    const [item, setItem] = useState(data.results); // Estado para los datos
    const [isEditing, setIsEditing] = useState(false); // Estado para determinar si estamos editando
    const [originalItem, setOriginalItem] = useState(data.results); // Estado para cancelar cambios

    // Divide las claves en dos mitades
    const keys = Object.keys(DiccHead);// Orden de los campos
    const half = Math.ceil(keys.length / 2);
    const leftKeys = keys.slice(0, half);  // Primera mitad de las claves
    const rightKeys = keys.slice(half);


    // Función para manejar el cambio de valor en un campo
    const handleChange = (e, key) => {
        console.log(item); //Quitarlo
        setItem({ ...item, [key]: e.target.value });
    };

    // Función para guardar y preparar los datos modificados para enviarlos al backend
    const handleSave = () => {
        console.log("Datos actualizados:", item); //Quitarlo
        onSave(item); // Envía los datos al padre
        setIsEditing(false); // Desactivar modo edición después de guardar
    };

    //Función para cancelar cambios
    const handleCancel = () => {
        setItem(originalItem);
        setIsEditing(false);
    };


    return (
        <div className="flex flex-col lg:flex-row justify-between gap-6 p-4">
            {/* Tabla izquierda */}
            <div className="w-full lg:w-1/2 overflow-x-auto">
                <h2 className="text-lg font-semibold mb-4">Datos Generales</h2>
                <table className="w-full border border-gray-300 rounded-lg shadow min-w-[300px]" /*table-fixed*/>
                    <tbody>
                        {leftKeys.map((key) => (
                            <tr key={key} className="border-b">
                                <th className="text-left p-2 bg-gray-300 font-medium whitespace-nowrap w-1/3">{DiccHead[key].label}</th>
                                <td className="p-2 max-w-[200px] break-words">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={item[key] || ""}
                                            onChange={(e) => handleChange(e, key)}
                                            className="p-2 border rounded w-full"
                                        />
                                    ) : (
                                        item[key] ?? "—"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tabla derecha */}
            <div className="w-full lg:w-1/2 overflow-x-auto">
                <h2 className="text-lg font-semibold mb-4">Información adicional</h2>
                <table className="w-full border border-gray-300 rounded-lg shadow table-fixed min-w-[300px]">
                    <tbody>
                        {rightKeys.map((key) => (
                            <tr key={key} className="border-b">
                                <th className="text-left p-2 bg-gray-300 font-medium whitespace-nowrap">{DiccHead[key].label}</th>
                                <td className="p-2 max-w-[200px] break-words">
                                    {key === "created_at" ? (
                                        FormattedDate(item[key])
                                    ) : isEditing && key === "user_name" ? (
                                        <select
                                            onChange={(e) => handleChange(e, "user_name")}
                                            className={`${styles.select_form} ${isEditing ? "text-black font-normal" : "italic text-gray-500"}`}
                                            required
                                        >
                                            <option key={key} value={item[key] || ""}>
                                                {item[key] || ""}
                                            </option>
                                            {userAssigns.filter(({ user_name }) => user_name !== item.user_name).map(({ user_id, user_name }) => (
                                                <option key={user_id} value={user_name}>{user_name}</option>
                                            ))}
                                        </select>
                                    ) : isEditing ? (
                                        <input
                                            type="text"
                                            value={item[key] || ""}
                                            onChange={(e) => handleChange(e, key)}
                                            className="p-2 border rounded w-full"
                                        />
                                    ) : (
                                        item[key] || "—"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Botón */}
            <div className="mt-4 self-start lg:self-center">
                <button
                    onClick={() => {
                        if (isEditing) {
                            handleSave();
                        } else {
                            setIsEditing(true);
                        }
                    }}
                    className={`px-4 py-2 ${isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded`}
                >
                    {isEditing ? "Guardar Cambios" : "Editar Datos"}
                </button>
                {/*Boton de cancelar */}        
                {isEditing && (
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </div>

    );
}

export default FileTableDetail