import React, { useState } from "react";
import styles from "../../styles";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import {
  IoCloudDownloadOutline,
  IoFilter,
  IoCaretUpOutline,
  IoCaretDownOutline,
  IoSearchSharp,
} from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

import LoadingScreen from "../LoadingScreen";
import Cookies from "js-cookie";
import FilterDropdown from "./FilterDropdown";
import { FiSend } from "react-icons/fi";

// Formato Fecha //TODO cambiar formato fechas
function FormattedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear(); // Local
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Local
  const day = String(date.getDate()).padStart(2, "0"); // Local
  return `${day}/${month}/${year}`;
}

// Formato Fecha para comparar YYYY-MM-DD
const FormatDateForComparison = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

// Formato Moneda
const formatCurrency = (value) => {
  return Number(value).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
};

const statusColor = {
  Terminado: "bg-[#39a336] shadow-green-600/40 shadow-lg",
  Cancelada: "bg-[#b74141] shadow-red-600/40 shadow-lg",
  Anulado: "bg-[#014293] shadow-blue-500/70 shadow-lg",
};

const HistoricalTable = ({
  dataBoard,
  api,
  handleCancelledForm,
  getSearch,
  searchTerm,
  setError,
  setSuccess,
  setShowSendForm,
  selectedIds, 
  setSelectedIds,
}) => {
  const [checkAll, setCheckAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "default",
  });
  const [searchTermLocal, setSearchTermLocal] = useState(searchTerm || "");
  const [filters, setFilters] = useState({
    //Filtros
    type_pipeline: "",
    assigned_user_sender: "",
    status: "",
    concept: "",
    created_at: "",
    subtotal: "",
    iva: "",
    total_refund: "",
    receiver_name_rs: "",
  });

  // Diccionario de columnas, Se usa para generar los encabezados de la tabla y los filtros
  const columns = [
    { label: "ID", key: "pipeline_id" },
    { label: "Tipo", key: "type_pipeline" },
    { label: "Asignado", key: "assigned_user_sender" },
    { label: "Concepto", key: "concept" },
    { label: "Creación", key: "created_at" },
    { label: "Subtotal", key: "subtotal" },
    { label: "Iva", key: "iva" },
    { label: "Monto", key: "total_refund" },
    { label: "Receptor", key: "receiver_name_rs" },
    { label: "Estatus", key: "status" },
    { label: "Acciones", key: "acciones" },
  ];

  const role = Cookies.get("role_id");

  const handleDownload = async () => {
    if (selectedIds.length === 0) {
      setError("No hay elementos seleccionados.");
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

      if (!response.ok) throw new Error("Error en la petición");

      const blob = await response.blob(); // Obtener el ZIP como blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Facturas_${new Date().toISOString().split("T")[0]}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess("Archivos descargados correctamente.");
    } catch (err) {
      //setError(err.message);
      console.error(err);
      setError("Ocurrió un error al descargar los archivos.");
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

  const handleClickSend = () => {
    if (selectedIds.length === 0) {
      setError("No hay elementos seleccionados.");
      return;
    }
    setShowSendForm(true);
  }

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        const nextDirection =
          prev.direction === "default"
            ? "asc"
            : prev.direction === "asc"
            ? "desc"
            : "default";
        return { key: columnKey, direction: nextDirection };
      } else {
        return { key: columnKey, direction: "asc" };
      }
    });
  };

  // FILTRADO
  const filteredData = dataBoard.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key === "created_at") {
        return FormatDateForComparison(item[key]) === value;
      }
      return item[key] === value;
    });
  });

  // ORDENAMIENTO
  const sortedData = [...filteredData];
  if (sortConfig.key && sortConfig.direction !== "default") {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      // Especial para fechas
      if (sortConfig.key === "created_at") {
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
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
          <div className="flex flex-row font-inter items-end justify-end gap-5 px-4 py-3 bg-[#313131] border-[#313131] rounded-t-lg">
            {/* <button className="flex items-center gap-2 text-sm p-2 font-semibold text-white hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all">
              <FaRegTrashAlt className="w-4 h-4 fill-current" />
              Eliminar
            </button> */}
            {role === "1" && (
              <button
                onClick={handleClickSend}
                className="flex items-center gap-2 text-sm p-2 font-semibold text-white hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all"
              >
                <FiSend className="w-5 h-5" />
                Enviar
              </button>
            )}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-sm p-2 font-semibold text-white  rounded-md hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all"
            >
              <IoCloudDownloadOutline className="w-5 h-5 fill-current" />
              Descargar
            </button>
            {/* <button className="flex items-center gap-2 text-sm p-2 font-semibold text-white  rounded-md hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all">
              <IoFilter className="w-4 h-4 fill-current" />
              Filtros
            </button> */}
            {/* <FilterDropdown /> */}
            <div className="flex flex-row items-center shadow-lg">
              <input
                className="text-sm px-2 py-2 rounded-l-md border-2 border-r-0 border-[#4e4e4e] text-white bg-[#1f1f1f] placeholder-gray-400 focus:outline-none"
                type="text"
                placeholder="Buscar..."
                value={searchTermLocal}
                onChange={(e) => setSearchTermLocal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log(searchTermLocal);
                    getSearch(searchTermLocal);
                  }
                }}
              />
              <button
                className="flex items-center gap-2 text-sm px-3 py-2 font-semibold text-white border-2 border-[#4e4e4e] rounded-r-md hover:text-[#eeb13f] hover:cursor-pointer hover:border-[#eeb13f] transition-all"
                onClick={() => {
                  console.log(searchTermLocal);
                  getSearch(searchTermLocal);
                }}
              >
                Buscar
              </button>
            </div>
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
                    ${
                      checkAll
                        ? "bg-[#1a1a1a] border-[#eeb13f] text-[#eeb13f] hover:border-[#8e8260]"
                        : "bg-[#1a1a1a] border-[#8e8260] hover:border-[#eeb13f] text-[#fff]"
                    }`}
                  >
                    {checkAll ? "✓" : "−"}
                  </button>
                </th>

                {/* Generación de Encabezados con uso de diccionario y con ordenamiento */}
                {columns.map((item) => (
                  <th
                    key={item.key}
                    className={`${styles.table_header_cell} ${
                      item.key !== "acciones"
                        ? "cursor-pointer select-none"
                        : ""
                    }`}
                    onClick={() =>
                      item.key !== "acciones" && handleSort(item.key)
                    }
                  >
                    <div className="flex items-center justify-center gap-1 mb-[-1.5vh]">
                      <span>{item.label}</span>
                      {item.key !== "acciones" &&
                        (sortConfig.key === item.key ? (
                          sortConfig.direction === "asc" ? (
                            <IoCaretUpOutline className="text-sm" />
                          ) : sortConfig.direction === "desc" ? (
                            <IoCaretDownOutline className="text-sm" />
                          ) : (
                            <IoFilter className="text-sm" />
                          )
                        ) : (
                          <IoFilter className="text-sm" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>

              {/* Filtros */}
              <tr>
                <th></th>
                {columns.map((col) => (
                  <th key={`filter-${col.key}`}>
                    {(col.key !== "acciones") & (col.key !== "pipeline_id") ? (
                      <select
                        value={filters[col.key] || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [col.key]: e.target.value,
                          }))
                        }
                        className="focus:bg-[#313131] px-0.5 py-0.5 rounded-sm text-sm font-inter text-white w-4/5 mb-[1vh] hover:cursor-pointer"
                      >
                        <option value="">Todos</option>
                        {[
                          ...new Set(
                            dataBoard.map((item) => {
                              if (col.key === "created_at") {
                                return FormatDateForComparison(item[col.key]); // Formato de fecha
                              }
                              return item[col.key];
                            })
                          ),
                        ].map((option) => {
                          const isCurrency = [
                            "subtotal",
                            "iva",
                            "total_refund",
                          ].includes(col.key);
                          const displayValue = isCurrency
                            ? formatCurrency(option)
                            : col.key === "created_at"
                            ? FormattedDate(option)
                            : option;
                          return (
                            <option
                              key={option}
                              value={option}
                              className="bg-[#313131] text-white cursor-pointer"
                            >
                              {displayValue}
                            </option>
                          );
                        })}
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
                  <tr
                    key={item.pipeline_id}
                    className={`border-b-[2.5px] border-[#b9b9b9] last:border-none ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"
                    } hover:bg-[#313131] hover:text-white transition-all`}
                  >
                    <td className="p-4 text-center">
                      {item.status !== "Anulado" && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.pipeline_id)}
                          onChange={(e) => {
                            setSelectedIds((prev) =>
                              e.target.checked
                                ? [...prev, item.pipeline_id]
                                : prev.filter((id) => id !== item.pipeline_id)
                            );
                          }}
                          className="w-6 h-6 rounded-md border-2 transition-all hover:scale-120 hover:cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="p-4 text-center font-semibold">
                      {item.pipeline_id}
                    </td>
                    <td className="p-4 text-center">{item.type_pipeline}</td>
                    <td className="p-4 text-center">
                      {item.assigned_user_sender}
                    </td>
                    <td className="p-4 text-center">{item.concept}</td>
                    <td className="p-4 text-center">
                      {FormattedDate(item.created_at)}
                    </td>
                    <td className="p-4 text-center">
                      {formatCurrency(item.subtotal)}
                    </td>
                    <td className="p-4 text-center">
                      {formatCurrency(item.iva)}
                    </td>
                    <td className="p-4 text-center">
                      {formatCurrency(item.total_refund)}
                    </td>
                    <td className="p-4 text-center">{item.receiver_name_rs}</td>
                    <td className="p-4 text-center ">
                      <span
                        className={`px-3 py-1 items-center text-xs font-bold rounded-full text-white shadow-md ${
                          statusColor[item.status] || "bg-gray-400"
                        }`}
                      >
                        {item.status || "Desconocido"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {item.status !== "Anulado" &&
                        item.status !== "Cancelada" && (
                          <button
                            onClick={() =>
                              handleCancelledForm(item.pipeline_id)
                            }
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
                  <td
                    colSpan={columns.length + 1}
                    className="text-center py-5 text-gray-600 font-semibold"
                  >
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
