import React from "react";
import "./FilesTable.css";
import { useNavigate } from "react-router-dom";
import styles from "../../styles";
import { SlOptionsVertical } from "react-icons/sl";
import { MdOutlineCancel } from "react-icons/md";

function FilesTable({ newFiles, handleAnnulledForm, category }) {
  const navigate = useNavigate();

  const FormattedDate = ({ dateString }) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;

    return <div>{formattedDate}</div>;
  };

  return (
    <>
      <div className={styles.table_layout}>
        <div className={styles.table_container}>
          <div className="flex flex-row items-start justify-start  gap-5 px-4 py-3 bg-[#313131] border-[#313131] rounded-t-lg text-white">
            {category === 0 ? <span>Despacho</span> : <span>Clientes</span>}
          </div>
          
          <table className={`${styles.table}`/*rounded-2xl*/}>
            <thead className={styles.table_header}>
              <tr>
                {/* <tr>
                {[
                  "Razón Social",
                  "RFC",
                  "Teléfono",
                  "Email",
                  "Número de cuenta",
                  "Fecha de creación",
                  "Acciones",
                ].map((title) => (
                  <th key={title} className={styles.table_header_cell}>
                    {title}
                  </th>
                ))}
              </tr> */}
                <th className={`${styles.table_header_cell}`}>Razón Social</th>
                <th className={`${styles.table_header_cell}`}>RFC</th>
                <th
                  className={`${styles.table_header_cell} hidden lg:table-cell`}
                >
                  Teléfono
                </th>
                <th
                  className={`${styles.table_header_cell} hidden md:table-cell`}
                >
                  Email
                </th>
                <th
                  className={`${styles.table_header_cell}   hidden sm:table-cell`}
                >
                  Número de Cuenta
                </th>
                <th
                  className={`${styles.table_header_cell} hidden lg:table-cell`}
                >
                  Fecha de creación
                </th>
                <th className={`${styles.table_header_cell}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              {newFiles.length > 0 ? (
                newFiles.map((item, index) => (
                  <tr
                    key={item.client_id || item.insertId}
                    className={`border-b-[2.5px] border-[#b9b9b9]  last:border-none ${index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"
                      } hover:bg-[#313131] hover:text-white transition-all`}
                  >
                    <td
                      className="p-3 text-center font-semibold hover:cursor-pointer hover:font-bold hover:scale-120 hover:underline transition-all"
                      onClick={() => navigate(`/files/details/${item.client_id}`)}
                    >
                      {item.name_rs}
                    </td>
                    <td className="px-2 text-center">{item.rfc}</td>
                    <td className="px-1 text-center hidden lg:table-cell">
                      {item.phone}
                    </td>
                    <td className="px-3 text-center hidden md:table-cell text-[12px] lg:text-sm">
                      {item.email}
                    </td>
                    <td className=" text-center md-text-[12px] lg:text-sm hidden sm:table-cell">
                      {item.bank_account}
                    </td>
                    <td className=" text-center hidden lg:table-cell">
                      <FormattedDate dateString={item.created_at} />
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleAnnulledForm(item.client_id)}
                        className="text-[#9e824f] hover:text-[#eeb13f] pr-1 pl-2 scale-130 hover:cursor-pointer transition-all transform hover:scale-150"
                      >
                        {/* <SlOptionsVertical size={18} /> */}
                        <MdOutlineCancel size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                // Si no hay Datos, muestra un mensaje
                <tr>
                  <td colSpan={7} className="text-center py-5 text-gray-600 font-semibold">
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
}

export default FilesTable;
