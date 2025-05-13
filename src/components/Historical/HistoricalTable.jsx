import React, { useState } from "react";
import styles from "../../styles";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import { IoCloudDownloadOutline, IoFilter, IoCaretUpOutline, IoCaretDownOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

import LoadingScreen from "../LoadingScreen";
import Cookies from "js-cookie";

// Formato Fecha
const dateToDays = (date) => {
  const today = new Date();
  const invoiceDate = new Date(date);
  const timeDiff = Math.abs(today - invoiceDate);
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert to days
  return `${diffDays} día(s)`;
};

// Formato Moneda
const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
};

const statusColor = {
  Terminado: "bg-[#39a336] shadow-green-600/40 shadow-lg",
  Cancelada: "bg-[#b74141] shadow-red-600/40 shadow-lg",
  Anulado: "bg-[#014293] shadow-blue-500/70 shadow-lg",
};

const HistoricalTable = ({ dataBoard, api, handleAnnulledForm }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
  const [filters, setFilters] = useState({});

  const columns = [
    { label: "ID", key: "pipeline_id" },
    { label: "Tipo", key: "type_pipeline" },
    { label: "Asignado", key: "assigned_user_sender" },
    { label: "Concepto", key: "concept" },
    { label: "Tiempo", key: "created_at" },
    { label: "Subtotal", key: "subtotal" },
    { label: "Iva", key: "iva" },
    { label: "Monto", key: "total_refund" },
    { label: "Razón Social (Receptor)", key: "receiver_name_rs" },
    { label: "Estatus", key: "status" },
    { label: "Acciones", key: "acciones" },
  ];

  const handleDownload = async () => {
    setLoading(true); // Carga inicial
    if (selectedIds.length === 0) {
      alert("No hay elementos seleccionados.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${api}/historical/docs/byid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

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
  };

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

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        const nextDirection =
          prev.direction === 'default' ? 'asc'
            : prev.direction === 'asc' ? 'desc'
              : 'default';
        return { key: columnKey, direction: nextDirection };
      } else {
        return { key: columnKey, direction: 'asc' };
      }
    });
  };

  // FILTRADO
  const filteredData = dataBoard.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const cellValue = item[key];
      return String(cellValue).toLowerCase().includes(value.toLowerCase());
    });
  });

  // ORDENAMIENTO
  const sortedData = [...filteredData];
  if (sortConfig.key && sortConfig.direction !== 'default') {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      // Especial para fechas
      if (sortConfig.key === "created_at") {
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      if (typeof aVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }

  if (loading) return <LoadingScreen message="Cargando..." />;

  return (
    <>
      <div className={styles.table_layout}>
        <div className={styles.table_container}>
          {/* Botones */}
          <div className="flex flex-row items-end justify-end gap-5 px-4 py-3 bg-[#313131] border-[#313131] rounded-t-lg">
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

          {/*Header */}
          <table className={styles.table}>
            <thead className={styles.table_header}>
              {/* Encabezado principal con ordenamiento */}
              <tr>
                <th className="flex p-4">
                  <button
                    onClick={handleCheckAll}
                    className={`w-6 h-6 flex items-center justify-center rounded-md border-2 hover:cursor-pointer hover:scale-120 transform transition-all 
                    ${checkAll ? "bg-[#1a1a1a] border-[#eeb13f] text-[#eeb13f]" : "bg-[#1a1a1a] border-[#fff] text-[#fff]"}`}
                  >
                    {checkAll ? "✓" : "−"}
                  </button>
                </th>
                {columns.map((item) => (
                  <th
                    key={item.key}
                    className={`${styles.table_header_cell} p-4 text-center ${item.key !== "acciones" ? "cursor-pointer select-none" : ""}`}
                    onClick={() => item.key !== "acciones" && handleSort(item.key)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{item.label}</span>
                      {item.key !== "acciones" && (
                        sortConfig.key === item.key
                          ? (sortConfig.direction === "asc" ? <IoCaretUpOutline className="text-sm" />
                            : sortConfig.direction === "desc" ? <IoCaretDownOutline className="text-sm" />
                              : <IoFilter className="text-sm" />)
                          : <IoFilter className="text-sm" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>

              {/* Filtros */}
              <tr>
                <th></th>
                {columns.map((item) => (
                  <th key={`${item.key}-filter`} className="p-1 text-center">
                    {item.key !== "acciones" && item.key !== "status" ? (
                      <input
                        type="text"
                        value={filters[item.key] || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, [item.key]: e.target.value })
                        }
                        placeholder="Filtrar"
                        className="w-full px-1 py-0.5 text-xs rounded border border-gray-300"
                      />
                    ) : item.key === "status" ? (
                      <select
                        value={filters[item.key] || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, [item.key]: e.target.value })
                        }
                        className="w-full px-1 py-0.5 text-xs rounded border border-gray-300 text-black"
                      >
                        <option value="">Todos</option>
                        <option value="Terminado">Terminado</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="Anulado">Anulado</option>
                      </select>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/*Body*/}
            <tbody className={styles.table_body}>
              {sortedData.length > 0 ? (
                sortedData.map((item, index) => (
                  <tr key={item.pipeline_id}
                    className={`border-b-[2.5px] border-[#b9b9b9] last:border-none ${index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"} hover:bg-[#313131] hover:text-white transition-all`}
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
                          className="text-[#9e824f] hover:text-[#eeb13f] pr-1 pl-2 scale-130 hover:cursor-pointer transition-all transform hover:scale-150"
                        >
                          <MdOutlineCancel size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                // Si no hay facturas, muestra un mensaje
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-5 text-gray-600 font-semibold">
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
