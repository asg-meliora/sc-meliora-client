import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import styles from "../../styles";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaEdit } from "react-icons/fa";

const InvoicesTable = ({
  dataBoard,
  invoiceStatus,
  handleAnnulledForm,
  adminStatus,
}) => {
  const navigate = useNavigate();

  if (invoiceStatus === 1) localStorage.clear(); // TODO: CHANGE WITH REFACTORING

  const statusMap = ["", "Iniciado", "En proceso", "Terminado"];
  const statusColor = [
    "",
    "text-[#eeedeb]",
    "text-[#d2b72a]",
    "text-[#89e089]",
  ];

  //Manejo empty data, checa si dataBoard es un array, si no lo es, lo convierte en un array vacio
  const invoices = Array.isArray(dataBoard)
    ? dataBoard
    : dataBoard?.results ?? [];

  //Filtra las facturas para cada pipeline
  const filteredInvoices = invoices.filter(
    (invoice) => invoice.status === statusMap[invoiceStatus]
  );

  const columns = [
    "ID",
    "Tipo",
    "Asignado",
    "Concepto",
    "Ciclo de Vida",
    "Subtotal",
    "Razón Social (Receptor)",
    "Acciones",
  ];
  // const columns = [
  //   "ID",
  //   "Tipo",
  //   "Asignado",
  //   "Concepto",
  //   "Ciclo de Vida",
  //   "Subtotal",
  //   "Razón Social (Receptor)",
  //   ...(invoiceStatus === 1 && adminStatus === 1 ? ["Acciones"] : []),
  // ];

  // TODO: Date convertion to days
  const dateToDays = (date) => {
    const today = new Date();
    const invoiceDate = new Date(date);
    const diffDays = Math.ceil(
      Math.abs(today - invoiceDate) / (1000 * 3600 * 24)
    );
    return `${diffDays} día(s)`;
  };

  // TODO: Format subtotal to currency
  const formatCurrency = (value) =>
    Number(value).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });

  // Manejo de la navegación al hacer clic en una fila de la tabla
  // Si el rol es admin, navega a la ruta de admin, si no, navega a la ruta de usuario
  const handleNavigate = (pipelineId) => {
    if (adminStatus === 1) {
      navigate(`/invoices/details/${pipelineId}`);
    } else {
      const userId = Cookies.get("user_id");
      navigate(`/user/invoices/${userId}/details/${pipelineId}`);
    }
  };

  return (
    <div className={styles.table_layout}>
      <div className={styles.table_container}>
        <div
          className={`flex items-center justify-between px-4 py-3 bg-[#313131] border-[#313131] ${statusColor[invoiceStatus]} rounded-t-lg`}
        >
          <h2 className="text-lg font-semibold">{statusMap[invoiceStatus]}</h2>

          {/* <button className="flex items-center gap-2 text-sm hover:text-[#eeb13f] transition-all">
               <svg
                 className="w-4 h-4 fill-current"
                 xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 24 24"
               >
                 <path d="M3 4h18v2H3V4zm4 7h10v2H7v-2zm-4 7h18v2H3v-2z" />
               </svg>
               Filtros
             </button> */}
        </div>

        {/* const columns = [
      "ID",
      "Tipo",
      "Asignado",
      "Concepto",
      "Ciclo de Vida",
      "Subtotal",
      "Razón Social (Receptor)",
      "Acciones",
    ]; */}

        {/* Tabla Header */}
        <table className={styles.table}>
          <thead className={styles.table_header}>
            <tr>
              {/* {columns.map((title) => (
                <th key={title} className={styles.table_header_cell}>
                  {title}
                </th>
              ))} */}
              <th className={`${styles.table_header_cell}`}>ID</th>
              <th className={`${styles.table_header_cell}`}>Tipo</th>
              <th className={`${styles.table_header_cell} hidden sm:table-cell`}>Asignado</th>
              <th className={`${styles.table_header_cell} hidden sm:table-cell`}>Concepto</th>
              <th className={`${styles.table_header_cell}`}>Ciclo de Vida</th>
              <th className={`${styles.table_header_cell} hidden md:table-cell`}>Subtotal</th>
              <th className={`${styles.table_header_cell} hidden lg:table-cell`}>Razón Social (Receptor)</th>
              <th className={`${styles.table_header_cell}`}>Acciones</th>
            </tr>
          </thead>

          {/* Tabla Body */}
          <tbody className={styles.table_body}>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice, index) => (
                <tr
                  key={invoice.pipeline_id}
                  className={`border-b-[2.5px] border-[#b9b9b9] last:border-none ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"
                  } hover:bg-[#313131] hover:text-white transition-all`}
                >
                  <td
                    className="p-4 text-center font-semibold"
                    // className="p-4 text-center font-semibold hover:cursor-pointer hover:font-bold hover:scale-120 hover:underline transition-all"
                    // onClick={() => handleNavigate(invoice.pipeline_id)}
                  >
                    {invoice.pipeline_id}
                  </td>
                  <td className="p-4 text-center">{invoice.type_pipeline}</td>
                  <td className="p-4 text-center hidden sm:table-cell">
                    {invoice.assigned_user_sender}
                  </td>
                  <td className="p-4 text-center hidden sm:table-cell">{invoice.concept}</td>
                  <td className="p-4 text-center">
                    {dateToDays(invoice.created_at)}
                  </td>
                  <td className="p-4 text-center hidden md:table-cell">
                    {formatCurrency(invoice.subtotal)}
                  </td>
                  <td className="p-4 text-center hidden lg:table-cell max-w-[300px] break-all">
                    {invoice.receiver_name_rs}
                  </td>
                  {/*Botón de cancelar, Si el estado de la factura es "Iniciado" y el rol es admin, */}
                  {invoiceStatus === 1 && adminStatus === 1 && (
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleNavigate(invoice.pipeline_id)}
                        className="mr-1 text-[#9e824f] hover:text-[#eeb13f] scale-120 hover:cursor-pointer transition-all hover:scale-140"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleAnnulledForm(invoice.pipeline_id)}
                        className="ml-1 text-[#9e824f] hover:text-[#eeb13f] pr-1 pl-2 scale-130 hover:cursor-pointer transition-all hover:scale-150"
                      >
                        <MdOutlineCancel size={18} />
                      </button>
                    </td>
                  )}
                  {invoiceStatus !== 1 && adminStatus === 1 && (
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleNavigate(invoice.pipeline_id)}
                        className="text-[#9e824f] hover:text-[#eeb13f] scale-120 hover:cursor-pointer transition-all hover:scale-140"
                      >
                        <FaEdit size={18} />
                      </button>
                    </td>
                  )}
                  {adminStatus !== 1 && (
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleNavigate(invoice.pipeline_id)}
                        className="text-[#9e824f] hover:text-[#eeb13f] scale-120 hover:cursor-pointer transition-all  hover:scale-140"
                      >
                        <FaEdit size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              // Si no hay facturas, muestra un mensaje
              <tr>
                <td
                  colSpan={columns.length}
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
  );
};

export default InvoicesTable;
