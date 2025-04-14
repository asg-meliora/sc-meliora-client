import React from "react";
import "./FilesTable.css";
import { useNavigate } from "react-router-dom";
import styles from "../../styles";
import { SlOptionsVertical } from "react-icons/sl";

function FilesTable({ newFiles }) {
  const navigate = useNavigate();

  // "client_id": 6,
  // "name_rs": "exampleRS5",
  // "rfc": "GFC435",
  // "curp": "LPKI2RTY5",
  // "address": "calle5",
  // "zip_code": "904504",
  // "phone": "7771232334",
  // "email": "exapmle2cliente@ex.com",
  // "bank_account": "0129301923"
  // "created_at": "2025-03-25T00:57:41.000Z"

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
          <table className={`${styles.table} rounded-2xl`}>
            <thead className={styles.table_header}>
              <tr>
                {[
                  "Razón Social",
                  "RFC",
                  "CURP",
                  "Dirección",
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
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              {newFiles.results.map((item, index) => (
                <tr
                  key={item.client_id || item.insertId}
                  className={`border-b-[2.5px] border-[#b9b9b9]  last:border-none ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-[#c5c5c5]"
                  } hover:bg-[#313131] hover:text-white transition-all`}
                >
                  <td
                    className="p-4 text-center font-semibold hover:cursor-pointer hover:font-bold hover:scale-120 hover:underline transform transition-all"
                    onClick={() => navigate(`/files/details/${item.client_id}`)}
                  >
                    {item.name_rs}
                  </td>
                  <td className="p-4 text-center">{item.rfc}</td>
                  <td className="p-4 text-center">{item.curp}</td>
                  <td className="p-4 text-center">{item.address}</td>
                  <td className="p-4 text-center">{item.phone}</td>
                  <td className="p-4 text-center">{item.email}</td>
                  {/* <td className="p-4 text-center">{item.zip_code}</td> */}
                  <td className="p-4 text-center">{item.bank_account}</td>{" "}
                  <td className="p-4 text-center">
                    <FormattedDate dateString={item.created_at} />
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
}

export default FilesTable;
