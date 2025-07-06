import React from "react";
import { useState } from "react";
import styles from "../../styles";
import { AnimatePresence } from "framer-motion";
import { validateEmail } from "../../validations";
import ErrorFormText from "../ErrorFormText";

const SendForm = ({ setShowSendForm, selectedIds, setSuccess }) => {
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState(
       {
        email_receiver: "",
        cc: "",
        subject: "",
        content: "",
        items: "",
      }
    );

  const st = {
    email_input_container:
      "flex flex-col sm:flex-row md:gap-3 border-b border-gray-300 py-1 w-full",
    email_label: "text-blackN font-inter font-medium text-[18px] min-w-[9%] md:min-w-[7.5%]",
    email_input:
      "w-full font-inter text-[18px] focus:outline-none placeholder:italic",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailValidation = validateEmail(formData.email_receiver);
    if (!emailValidation.valid) { 
      setError(emailValidation.error);
      return;
    }
    
    setError(null);
    
    setShowSendForm(false);
    setSuccess("Facturas enviadas correctamente.")
    
  }
  

  return (
    <>
      <div
        className={`mx-auto bg-radial from-[#ffffff] via-[#f0f0f0] to-[#dfdfdf] text-black px-3 py-3 rounded-lg shadow-xl  | relative w-[80vw] lg:w-[80vh] max-w-5xl h-[] max-h-[95vh] flex flex-col`}
      >
        {/* Close Form Button */}
        <button
          onClick={() => setShowSendForm(false)}
          className={styles.close_form_button}
        >
          ✕
        </button>
        <h2 className={styles.form_heading}>Enviar Facturas</h2>
        <div className={error ? "mb-[-5px]" : ""}>
          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <ErrorFormText
                key="form-error-message"
                message={error}
                onClose={() => setError(null)}
              />
            )}
          </AnimatePresence>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`${styles.form} overflow-y-auto max-h-[calc(100vh-120px)]`}
          noValidate
        >
          <div className="flex flex-col gap-4 max-h-[90vh] overflow-y-auto py-2 px-6 w-full max-w-5xl">
            {/* Destinatario */}
            <div className={`${st.email_input_container}`}>
              <label className={`${st.email_label}`}>Para</label>
              <input
                type="email"
                name="email_receiver"
                value={formData.email_receiver || ""}
                onChange={handleChange}
                className={`${st.email_input}`}
                required
              />
            </div>
            {/* Cc */}
            <div className={`${st.email_input_container}`}>
              <label className={`${st.email_label}`}>CC </label>
              <input
                type="text"
                name="cc"
                value={formData.cc || ""}
                onChange={handleChange}
                className={`${st.email_input}`}
                required
              />
            </div>
            {/* Asunto */}
            <div className={`${st.email_input_container}`}>
              {/* <label className={`${st.email_label}`}>Asunto</label> */}
              <input
                type="text"
                name="subject"
                value={formData.subject || ""}
                onChange={handleChange}
                placeholder="Asunto"
                className={`${st.email_input}`}
                required
              />
            </div>
            {/* Contenido */}
            <div className={`flex flex-col md:flex-row md:gap-3  py-1 w-full`}>
              {/* <label className={`${st.email_label}`}>Contenido</label> */}
              <textarea
                name="content"
                id=""
                value={formData.content || ""}
                onChange={handleChange}
                className={`${st.email_input} resize-none`}
                rows={5}
              ></textarea>
            </div>
            {/* Adjuntar Archivos */}
            <div className="flex flex-col gap-2 py-1 w-full">
              <p className={`text-blackN font-inter font-medium text-[18px] mb-[-10px]`}>Facturas adjuntas</p>
              <div className="flex flex-row gap-2 font-inter text-[16px] text-gray-800">
                <p>|</p>
                {selectedIds.map((item, index) => (
                  <p key={index}>{item} |</p>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={`${styles.send_button} mt-[-5px] mb-2`}
          >
            Enviar
          </button>
        </form>
      </div>
    </>
  );
};

export default SendForm;
