import styles from "../../styles";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";

const HistoricalTable = ({ dataBoard }) => {
  const statusMap = ["", "Iniciada", "En Progreso", "Finalizada", "Cancelada"];
  const statusColor = [
    "",
    "bg-[#313131] shadow-gray-500/70",
    "bg-[#c8a929] shadow-amber-700/40 shadow-lg",
    "bg-[#39a336] shadow-green-600/40 shadow-lg",
    "bg-[#b74141] shadow-red-600/40 shadow-lg",
  ];

  // TODO: Date convertion to days
  const dateToDays = (date) => {
    const today = new Date();
    const invoiceDate = new Date(date);
    const timeDiff = Math.abs(today - invoiceDate);
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert to days
  };

  // TODO: Format subtotal to currency
  const formatCurrency = (value) => {
    return Number(value).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });
  };

  const [checkAll, setCheckAll] = useState(false);

  const handleCheckAll = () => {
    setCheckAll(!checkAll);
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !checkAll;
    });
  };

  return (
    <>
      <div className={styles.table_layout}>
        <div className={styles.table_container}>
          {/* Buttons */}
          <div
            className={`flex flex-row items-end justify-end gap-5 px-4 py-3 bg-[#313131] border-[#313131] rounded-t-lg`}
          >
            <button className="flex items-center gap-2 text-sm p-2 font-semibold text-white hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all">
              <FaRegTrashAlt className="w-4 h-4 fill-current" />
              Eliminar
            </button>
            <button className="flex items-center gap-2 text-sm p-2 font-semibold text-white hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all">
              <IoFilter className="w-4 h-4 fill-current" />
              Filtros
            </button>
            <button className="flex items-center gap-2 text-sm p-2 font-semibold text-white border-[1px] rounded-md hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all">
              <BsSend className="w-4 h-4 fill-current" />
              Enviar
            </button>
            <button className="flex items-center gap-2 text-sm p-2 font-semibold text-white border-[1px] rounded-md hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all">
              <IoCloudDownloadOutline className="w-4 h-4 fill-current" />
              Descargar
            </button>
          </div>

          <table className={styles.table}>
            <thead className={styles.table_header}>
              <tr>
                <th className="flex p-4">
                  {/* <input
                    type="checkbox"
                    name="select_all"
                    className="self-center"
                  /> */}
                  <button
                    onClick={handleCheckAll}
                    className={`w-6 h-6 flex items-center justify-center rounded-md border-2 hover:cursor-pointer hover:scale-120 transform transition-all 
                    ${
                      checkAll
                        ? "bg-[#1a1a1a] border-[#eeb13f] text-[#eeb13f]"
                        : "bg-[#1a1a1a] border-[#fff] text-[#fff]"
                    }`}
                  >
                    {checkAll && <div className="text-xl leading-none">✓</div>}
                    {!checkAll && <div className="text-xl leading-none">−</div>}
                  </button>
                </th>
                {[
                  "ID",
                  "Tipo",
                  "Asignado",
                  "Concepto",
                  "Ciclo de Vida",
                  "Monto",
                  "Razón Social",
                  "Estatus",
                  "Acciones",
                ].map((title) => (
                  <th key={title} className={styles.table_header_cell}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              {dataBoard.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b-[2.5px] border-[#b9b9b9]  last:border-none ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"
                  } hover:bg-[#313131] hover:text-white transition-all`}
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      name={`select_${item.id}`}
                      className="w-6 h-6 flex items-center justify-center rounded-md border-2 hover:cursor-pointer hover:scale-120 transform transition-all"
                    />
                  </td>
                  <td className="p-4 text-center font-semibold">{item.id}</td>
                  <td className="p-4 text-center">{item.type}</td>
                  <td className="p-4 text-center">{item.user_assigned}</td>
                  <td className="p-4 text-center">{item.concept}</td>
                  <td className="p-4 text-center">
                    {dateToDays(item.created_at)} día(s)
                  </td>
                  <td className="p-4 text-center">
                    {formatCurrency(item.subtotal)}
                  </td>
                  <td className="p-4 text-center">{item.legal_name}</td>
                  {/* <td className={`p-4 text-center ${statusColor[item.status]}`}>
                    {statusMap[item.status]}
                  </td> */}
                  <td className="p-4 text-center ">
                    <span
                      className={`px-3 py-1 items-center text-xs font-bold rounded-full text-white shadow-md ${
                        statusColor[item.status]
                      }`}
                    >
                      {statusMap[item.status]}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {}}
                      className="text-[#9e824f] hover:text-[#eeb13f] pr-1 pl-2  hover:cursor-pointer transition-all transform hover:scale-120"
                    >
                      <SlOptionsVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HistoricalTable;
