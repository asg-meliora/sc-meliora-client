import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import styles from "../../styles";
import { useNavigate } from "react-router-dom";

const InvoicesTable = ({ dataBoard, invoiceStatus, handleOpenCancelForm, adminStatus }) => {
  const navigate = useNavigate();

  const statusMap = ["", "Iniciado", "En Progreso", "Finalizada"];
  const statusColor = ["", "text-[#eeedeb]", "text-[#d2b72a]", "text-[#89e089]"];

  //Manejo empty data, checa si dataBoard es un array, si no lo es, lo convierte en un array vacio
  const invoices = Array.isArray(dataBoard) ? dataBoard : dataBoard?.results ?? [];

  //Filtra las facturas para cada pipeline
  const filteredInvoices = invoices.filter(invoice => invoice.status === statusMap[invoiceStatus]);

  const columns = [
    "ID",
    "Tipo",
    "Asignado",
    "Concepto",
    "Ciclo de Vida",
    "Subtotal",
    "Razón Social (Receptor)",
    ...(invoiceStatus === 1 && adminStatus === 1 ? ["Acciones"] : [])
  ];

  // TODO: Date convertion to days
  const dateToDays = (date) => {
    const today = new Date();
    const invoiceDate = new Date(date);
    const diffDays = Math.ceil(Math.abs(today - invoiceDate) / (1000 * 3600 * 24));
    return `${diffDays} día(s)`;
  };

  // TODO: Format subtotal to currency
  const formatCurrency = (value) => Number(value).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

  const handleNavigate = (pipelineId) => {
    if (adminStatus === 1) {
      navigate(`/invoices/details/${pipelineId}`);
    } else {
      navigate('/');
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

        {/* Tabla Header */}
        <table className={styles.table}>
          <thead className={styles.table_header}>
            <tr>
              {columns.map((title) => (
                <th key={title} className={styles.table_header_cell}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Tabla Body */}
          <tbody className={styles.table_body}>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice, index) => (
                <tr
                  key={invoice.pipeline_id}
                  className={`border-b-[2.5px] border-[#b9b9b9] last:border-none ${index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"
                    } hover:bg-[#313131] hover:text-white transition-all`}
                >
                  <td
                    className="p-4 text-center font-semibold hover:cursor-pointer hover:font-bold hover:scale-120 hover:underline transform transition-all"
                    onClick={() => handleNavigate(invoice.pipeline_id)}
                  >
                    {invoice.pipeline_id}
                  </td>
                  <td className="p-4 text-center">{invoice.type_pipeline}</td>
                  <td className="p-4 text-center">{invoice.assigned_user_sender}</td>
                  <td className="p-4 text-center">{invoice.concept}</td>
                  <td className="p-4 text-center">{dateToDays(invoice.created_at)}</td>
                  <td className="p-4 text-center">{formatCurrency(invoice.subtotal)}</td>
                  <td className="p-4 text-center">{invoice.receiver_name_rs}</td>
                  {invoiceStatus === 1 && adminStatus === 1 && (
                    <td className="p-4 text-center">
                      <button
                        onClick={handleOpenCancelForm}
                        className="text-[#9e824f] hover:text-[#eeb13f] scale-120 hover:cursor-pointer transition-all transform hover:scale-140"
                      >
                        <MdOutlineCancel size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              // Si no hay facturas, muestra un mensaje
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-gray-600 font-semibold">
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