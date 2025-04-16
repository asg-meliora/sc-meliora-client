import React from 'react'

const FormattedDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

    return formattedDate;
};

function FileTableDetail({ data }) {
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

    const item = data.results; // Por legibilidad
    const keys = Object.keys(DiccHead);// Orden de los campos

    // Divide las claves en dos mitades
    const half = Math.ceil(keys.length / 2);
    const leftKeys = keys.slice(0, half);  // Primera mitad de las claves
    const rightKeys = keys.slice(half);

    return (
        <div className="flex justify-between gap-10 p-6 items-start "> {/* Contenedor flex con espacio entre las tablas */}
            {/* Título de la tabla izquierda */}
            <div className="w-1/2">
                <h2 className="text-lg font-semibold mb-4">Datos Generales</h2>
                <table className="w-full border border-gray-300 rounded-lg shadow table-fixed">
                    <tbody>
                        {leftKeys.map((key) => (
                            <tr key={key} className="border-b">
                                <th className="text-left p-2 bg-gray-200 font-medium">
                                    {DiccHead[key].label}
                                </th>
                                <td className="p-2">
                                    {item[key] ?? "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Título de la tabla derecha */}
            <div className="w-1/2">
                <h2 className="text-lg font-semibold mb-4">Información adicional</h2>
                <table className="w-full border border-gray-300 rounded-lg shadow table-fixed">
                    <tbody>
                        {rightKeys.map((key) => (
                            <tr key={key} className="border-b">
                                <th className="text-left p-2 bg-gray-200 font-medium">
                                    {DiccHead[key].label}
                                </th>
                                <td className="p-2">
                                    {key === "created_at" ? FormattedDate(item[key]) : (item[key] || "—")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FileTableDetail