import React, { useCallback, useEffect, useState } from "react";
import styles from "../../styles";

const FormattedDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
  return formattedDate;
};

const DiccHead = {
  name_rs: "Razón Social",
  rfc: "RFC",
  curp: "CURP",
  address: "Dirección",
  // zip_code: "Código Postal",
  // phone: "Teléfono",
  // email: "Correo Electrónico",
  bank_account: "No. Cuenta Bancaria",
  // created_at: "Fecha de creación",
  user_name: "Usuario Asignado",
};
const Dicc2Head = {
  name_rs: "Razón Social",
  rfc: "RFC",
  curp: "CURP",
  address: "Dirección",
  // zip_code: "Código Postal",
  // phone: "Teléfono",
  // email: "Correo Electrónico",
  bank_account: "No. Cuenta Bancaria",
  // created_at: "Fecha de creación",
  // user_name: "Usuario Asignado",
};
const documentType = {
  CSF: "CSF",
  CDD: "Comprobante Domicilio",
  CDB: "Caratula Bancaria",
};
const Dicc3Head = {
  pipeline_id: "ID",
  type_pipeline: "Tipo de Factura",
  concept: "Concepto",
  total_amount: "Total",
  subtotal: "Subtotal",
  iva: "IVA",
  total_refund: "Total Devolución",
  comision: "Cantidad de Comisión",
  comision_percentage: "Comisión (%)",
  payment_type: "Tipo de pago",
  cfdi_type: "Uso de CFDI",
  regimen_type: "Regimen Fiscal",
  status: "Estatus",
  created_at: "Fecha de creación",
};

const cfdiTypeMap = {
  G03: "Gasto En General",
  G04: "Pago",
  // puedes agregar más claves si es necesario
};
const regimenTypeMap = {
  601: "601 - General de Ley de Personas Morales",
  603: "603 - Personas Morales con Fines no Lucrativos",
  605: "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios",
  606: "606 - Arrendamiento",
  607: "607 - Régimen de Enajenación o Adquisición de Bienes",
  608: "608 - Demás Ingresos",
  610: "610 - Residentes en el Extranjero sin Establecimiento Permanente en México",
  611: "611 - Ingresos por Dividendos (socios y accionistas)",
  612: "612 - Personas Físicas con Actividades Empresariales y Profesionales",
  614: "614 - Ingresos por intereses",
  615: "615 - Régimen de los ingresos por obtención de premios",
  616: "616 - Sin obligaciones fiscales",
  620: "620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos",
  621: "621 - Incorporación Fiscal",
  622: "622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
  623: "623 - Opcional para Grupos de Sociedades",
  624: "624 - Coordinados",
  625: "625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
  626: "626 - Régimen Simplificado de Confianza"
};

function InvoicesDetailsTable({ invoice, sender, receiver, }) {
  //console.table(invoice);

  function InfoTable({ title, data, keys, dictionary, children, isRight = false }) {
    return (
      <>
        <h2 className={styles.d_table_heading}>{title}</h2>
        <table
          className={`${isRight
            ? "w-full h-[95%] border-separate border-spacing-0 border-6 border-[#F4F4F7] rounded-md min-w-[300px]" /*table-fixed*/
            : "w-full border-separate border-spacing-0 border-6  border-[#F4F4F7] rounded-md min-w-[300px]"
            } `}
        >
          <tbody>
            {keys.map((key) => (
              <tr key={key} className="align-center">
                <th
                  style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                  className={`${styles.d_table_header} border-b-6`}
                >
                  {dictionary[key] || "—"}
                </th>
                <td
                  style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                  className={`${styles.d_table_data} border-b-6`}
                >
                  {key === "created_at" ? FormattedDate(data[key]) : key === "cfdi_type" ? cfdiTypeMap[data[key]] ?? data[key]
                    : key === "regimen_type" ? regimenTypeMap[data[key]] ?? data[key] : data[key] ?? "—"}
                </td>
              </tr>
            ))}
            {children}
          </tbody>
        </table>
      </>
    );
  }

  return (
    <>
      {/* <div>InvoicesUserDetails {userId}/{invoiceId}</div> */}
      <div className={`${styles.d_table_container} `}>

        {/* Tabla izquierda */}
        <div className={`${styles.d_table_column_container} `}>
          <InfoTable title="Datos Emisor" data={sender} keys={Object.keys(DiccHead)} dictionary={DiccHead} />

          {/* Tabla izquierda Inferior */}
          <InfoTable title="Datos Receptor" data={receiver} keys={Object.keys(Dicc2Head)} dictionary={Dicc2Head}>
            {receiver?.documents?.length > 0 ? (
              receiver.documents.map(({ document_id, document_type, signedUrl }) => (
                <tr key={document_id} className="align-center">
                  <th
                    className={`${styles.d_table_header} border-b-6`}
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                  >
                    {documentType[document_type] || document_type}
                  </th>
                  <td
                    className={`${styles.d_table_data} border-b-6`}
                    style={{ boxShadow: "inset 0 3px 10px rgba(0, 0, 0, 0.2)" }}
                  >
                    <a
                      href={signedUrl}
                      download={`${signedUrl} -${document_id} `}
                      className="cursor-pointer downloadButton text-white px-3 py-1 rounded font-medium font-inter w-full shadow-md shadow-blue-700/60 hover:scale-110 hover:font-semibold transition-all"
                    >
                      Descargar
                    </a>
                    {/* <a //Esto es para previsualizar en dado caso que el cliente lo pida
                      href={signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-blue-600 underline"
                    >
                      Ver Documento
                    </a> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className={`${styles.d_table_header} border-b-6`}>Sin Archivos</td>
              </tr>
            )}
          </InfoTable>
        </div>

        {/* Tabla Derecha */}
        <div className="w-full lg:w-1/2 overflow-x-auto">
          <InfoTable title="Datos de la factura" data={invoice} keys={Object.keys(Dicc3Head)} dictionary={Dicc3Head} isRight={true} />
        </div>
      </div>

    </>
  );
}
export default InvoicesDetailsTable;
