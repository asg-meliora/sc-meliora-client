import { MdOutlineCancel } from "react-icons/md";
import styles from "../../styles";

const InvoicesTable = ({ dataBoard, invoiceStatus, handleOpenCancelForm }) => {
  console.log("dataBoard", dataBoard);
  const statusMap = ["", "Iniciada", "En Progreso", "Finalizada"];
  const statusColor = [
    "",
    "text-[#eeedeb]",
    "text-[#d2b72a]",
    "text-[#89e089]",
  ];

  // TODO: Date convertion to days
  const dateToDays = (date) => {
    const today = new Date();
    const invoiceDate = new Date(date);
    const timeDiff = Math.abs(today - invoiceDate);
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert to days
  }

  // TODO: Format subtotal to currency
  const formatCurrency = (value) => {
    return Number(value).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });
  };

  return (
    <>
      <div className={styles.table_layout}>
        <div className={styles.table_container}>
          <div
            className={`flex items-center justify-between px-4 py-3 bg-[#313131] border-[#313131] ${statusColor[invoiceStatus]} rounded-t-lg`}
          >
            <h2 className="text-lg font-semibold">
              {statusMap[invoiceStatus]}
            </h2>
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
          <table className={styles.table}>
            <thead className={styles.table_header}>
              {(invoiceStatus === 1
                ? [
                    "ID",
                    "Tipo",
                    "Asignado",
                    "Concepto",
                    "Ciclo de Vida",
                    "Subtotal",
                    "Razón Social",
                    "Acciones",
                  ]
                : [
                    "ID",
                    "Tipo",
                    "Asignado",
                    "Concepto",
                    "Ciclo de Vida",
                    "Subtotal",
                    "Razón Social",
                  ]
              ).map((title) => (
                <th key={title} className={styles.table_header_cell}>
                  {title}
                </th>
              ))}
            </thead>
            <tbody className={styles.table_body}>
              {dataBoard
                .filter((invoice) => invoice.status === invoiceStatus)
                .map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    className={`border-b-[2.5px] border-[#b9b9b9]  last:border-none ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"
                    } hover:bg-[#313131] hover:text-white transition-all`}
                  >
                    <td className="p-4 text-center font-semibold">
                      {invoice.id}
                    </td>
                    <td className="p-4 text-center">{invoice.type}</td>
                    <td className="p-4 text-center">{invoice.user_assigned}</td>
                    <td className="p-4 text-center">{invoice.concept}</td>
                    <td className="p-4 text-center">{dateToDays(invoice.created_at)} día(s)</td>
                    <td className="p-4 text-center">{formatCurrency(invoice.subtotal)}</td>
                    <td className="p-4 text-center">{invoice.legal_name}</td>
                    {invoiceStatus === 1 && (
                      <td className="p-4 text-center">
                        <button onClick={handleOpenCancelForm} className="text-[#9e824f] hover:text-[#eeb13f] scale-120 hover:cursor-pointer transition-all transform hover:scale-140">
                          <MdOutlineCancel size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InvoicesTable;
