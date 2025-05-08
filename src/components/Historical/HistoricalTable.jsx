import React, { useState } from "react";
import styles from "../../styles";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { IoCloudDownloadOutline, IoFilter } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";

import LoadingScreen from "../LoadingScreen";
import Cookies from "js-cookie";

// TODO: Date convertion to days
const dateToDays = (date) => {
  const today = new Date();
  const invoiceDate = new Date(date);
  const timeDiff = Math.abs(today - invoiceDate);
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert to days
  return `${diffDays} día(s)`;
};

// TODO: Format subtotal to currency
const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-MX", { style: "currency", currency: "MXN", });
};

const statusColor = {
  Terminado: "bg-[#39a336] shadow-green-600/40 shadow-lg",
  Cancelada: "bg-[#b74141] shadow-red-600/40 shadow-lg",
  Anulado: "bg-[#014293] shadow-blue-500/70 shadow-lg",
};


const HistoricalTable = ({ dataBoard, api, handleAnnulledForm }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga

  const columns = ["ID", "Tipo", "Asignado", "Concepto", "Ciclo de Vida", "Subtotal", "Iva", "Monto", "Razón Social (Receptor)", "Estatus", "Acciones"];

  const handleCheckAll = () => {
    if (checkAll) {
      setSelectedIds([]);
    } else {
      const allValidIds = dataBoard
        .filter((item) => item.status !== "Anulado")
        .map((item) => item.pipeline_id);
      setSelectedIds(allValidIds);
    }
    setCheckAll(!checkAll);
  };

  const handleDownload = async () => {
    console.log(selectedIds);
    if (selectedIds.length === 0) {
      alert("No hay elementos seleccionados.");
      return;
    }

    setLoading(true); // Carga inicial

    try {
      const response = await fetch(`${api}/historical/docs/byid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      //Error handling
      if (!response.ok) throw new Error("Error en la petición");

      const blob = await response.blob(); // Obtener el ZIP como blob
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Facturas_${new Date().toISOString().split("T")[0]}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      //setError(err.message);
      console.error(err);
      alert("Ocurrió un error al descargar los archivos.");
    } finally {
      setLoading(false); // Carga finalizada
      setSelectedIds([]);
    }
  }

  if (loading) {
    return <LoadingScreen message="Cargando..." />; // Pantalla de carga
  }


  return (
    <>
      <div className={styles.table_layout}>
        <div className={styles.table_container}>
          {/* Botones */}
          <div
            className={`flex flex-row items-end justify-end gap-5 px-4 py-3 bg-[#313131] border-[#313131] rounded-t-lg`}
          >
            {/* <button className="flex items-center gap-2 text-sm p-2 font-semibold text-white hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all">
              <FaRegTrashAlt className="w-4 h-4 fill-current" />
              Eliminar
            </button>
            <button className="flex items-center gap-2 text-sm p-2 font-semibold text-white hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all">
              <IoFilter className="w-4 h-4 fill-current" />
              Filtros
            </button> */}
            {/* <button className="flex items-center gap-2 text-sm p-2 font-semibold text-white border-[1px] rounded-md hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all">
              <BsSend className="w-4 h-4 fill-current" />
              Enviar
            </button> */}
            <button onClick={handleDownload} className="flex items-center gap-2 text-sm p-2 font-semibold text-white border-[1px] rounded-md hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all">
              <IoCloudDownloadOutline className="w-4 h-4 fill-current" />
              Descargar
            </button>
          </div>

          <table className={styles.table}>
            <thead className={styles.table_header}>
              <tr>
                <th className="flex p-4">
                  <button
                    onClick={handleCheckAll}
                    className={`w-6 h-6 flex items-center justify-center rounded-md border-2 hover:cursor-pointer hover:scale-120 transform transition-all 
                    ${checkAll
                        ? "bg-[#1a1a1a] border-[#eeb13f] text-[#eeb13f]"
                        : "bg-[#1a1a1a] border-[#fff] text-[#fff]"
                      }`}
                  >
                    {checkAll && <div className="text-xl leading-none">✓</div>}
                    {!checkAll && <div className="text-xl leading-none">−</div>}
                  </button>
                </th>
                {columns.map((title) => (
                  <th key={title} className={styles.table_header_cell}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              {dataBoard.length > 0 ? (
                dataBoard.map((item, index) => (
                  <tr key={item.pipeline_id}
                    className={`border-b-[2.5px] border-[#b9b9b9] last:border-none ${index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"
                      } hover:bg-[#313131] hover:text-white transition-all`}
                  >
                    <td className="p-4 text-center">
                      {item.status !== "Anulado" && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.pipeline_id)}
                          onChange={(e) => { setSelectedIds((prev) => e.target.checked ? [...prev, item.pipeline_id] : prev.filter((id) => id !== item.pipeline_id)); }}
                          className="w-6 h-6 rounded-md border-2 transition-all hover:scale-120 hover:cursor-pointer"
                        />
                      )}
                    </td>

                    <td className="p-4 text-center font-semibold">{item.pipeline_id}</td>
                    <td className="p-4 text-center">{item.type_pipeline}</td>
                    <td className="p-4 text-center">{item.assigned_user_sender}</td>
                    <td className="p-4 text-center">{item.concept}</td>
                    <td className="p-4 text-center">{dateToDays(item.created_at)}</td>
                    <td className="p-4 text-center">{formatCurrency(item.subtotal)}</td>
                    <td className="p-4 text-center">{formatCurrency(item.iva)}</td>
                    <td className="p-4 text-center">{formatCurrency(item.total_refund)}</td>
                    <td className="p-4 text-center">{item.receiver_name_rs}</td>
                    <td className="p-4 text-center ">
                      <span className={`px-3 py-1 items-center text-xs font-bold rounded-full text-white shadow-md ${statusColor[item.status] || "bg-gray-400"}`}>
                        {item.status || "Desconocido"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {item.status !== "Anulado" && item.status !== "Cancelada" && (
                        <button
                          onClick={() => handleAnnulledForm(item.pipeline_id)}
                          className="text-[#9e824f] hover:text-[#eeb13f] pr-1 pl-2 hover:cursor-pointer transition-all transform hover:scale-120"
                        >
                          <SlOptionsVertical size={18} />
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                // Si no hay facturas, muestra un mensaje
                <tr>
                  <td colSpan={columns.length} className="text-center py-5 text-gray-600 font-semibold">
                    No hay datos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HistoricalTable;
