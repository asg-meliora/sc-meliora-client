import React, { useEffect, useState } from "react";
// import styles from '../../styles';

function ModalValidationXML({ results, onClose }) {
  const [show, setShow] = useState(true);
  const timeOut = 10000;
  const [secondsLeft, setSecondsLeft] = useState(timeOut / 1000);

  useEffect(() => {
    const closeTimer = setTimeout(() => {
    setShow(false);
    onClose?.();
  }, timeOut);

    const interval = setInterval(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    clearTimeout(closeTimer);
    clearInterval(interval);
  };
  }, [onClose, timeOut]);

  if (!show) return null;

  const styles = {
    validation_heading: "text-xl font-bold font-inter",
    validation_result_container:
      "flex flex-col items-center justify-between py-2 px-4 border-2 rounded-lg shadow-sm",
    validation_text_bold: "font-semibold text-[#272727]",
    validation_text_italic: "italic text-[#383838]",
  };

  return (
    <div
      className={`max-w-[80vw] max-h-[calc(92svh)] mx-auto bg-radial from-[#ffffff] via-[#f0f0f0] to-[#dfdfdf] text-black px-6 py-3 rounded-lg shadow-xl relative`}
    >
      <button
        onClick={onClose} // <- Define esta función en tu componente padre
        className="absolute top-1 right-3 text-gray-400 hover:text-gray-700 hover:font-extrabold text-xl mx-2 my-1 hover:cursor-pointer hover:scale-120 transition-all"
      >
        X
      </button>
      <h2 className="text-2xl font-raleway font-bold mb-4 text-center">
        Resultado de validaciones
      </h2>
      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        {/* Subtotal */}
        <div
          className={`${styles.validation_result_container} relative ${
            results.subtotal.match
              ? "border-[#09930b] bg-[#2ebd3040]"
              : "border-[#cb3131] bg-[#ec5e5e52]"
          }`}
        >
          <span
            className={`absolute top-1 right-3 text-lg`}
          >
            {results.subtotal.match ? "✅" : "❌"}
          </span>
          <span
            className={`${styles.validation_heading} ${
              results.subtotal.match ? "text-[#2c892d]" : "text-[#c63030]"
            }`}
          >
            Subtotal
          </span>
          <div className="text-center">
            <p className="text-lg">
              <span className={`${styles.validation_text_bold}`}>
                Ingresado:
              </span>{" "}
              <span className={`${styles.validation_text_italic}`}>
                {results.subtotal.xml}
              </span>
            </p>

            <p className="text-lg">
              <span className={`${styles.validation_text_bold}`}>
                Esperado:
              </span>{" "}
              <span className={`${styles.validation_text_italic}`}>
                {results.subtotal.expected}
              </span>
            </p>
            {/* <p className={`text-sm font-bold ${results.subtotal.match ? 'text-green-600' : 'text-red-500'}`}>
                            {results.subtotal.match ? '✅ Coincide' : '❌ No coincide'}
                        </p> */}
          </div>
        </div>
        {/* IVA */}
        <div
          className={`${styles.validation_result_container} relative ${
            results.iva.match
              ? "border-[#09930b] bg-[#2ebd3040]"
              : "border-[#cb3131] bg-[#ec5e5e52]"
          }`}
        >
          <span
            className={`absolute top-1 right-3 text-lg`}
          >
            {results.iva.match ? "✅" : "❌"}
          </span>
          <span
            className={`${styles.validation_heading} ${
              results.iva.match ? "text-[#2c892d]" : "text-[#c63030]"
            }`}
          >
            IVA
          </span>
          <div className="text-center">
            <p className="text-lg">
              <span className={`${styles.validation_text_bold}`}>
                Ingresado:
              </span>{" "}
              <span className={`${styles.validation_text_italic}`}>
                {results.iva.xml}
              </span>
            </p>
            <p className="text-lg">
              <span className={`${styles.validation_text_bold}`}>
                Esperado:
              </span>{" "}
              <span className={`${styles.validation_text_italic}`}>
                {results.iva.expected}
              </span>
            </p>
            {/* <p className={`text-sm font-bold ${results.iva.match ? 'text-green-600' : 'text-red-500'}`}>
                            {results.iva.match ? '✅ Coincide' : '❌ No coincide'}
                        </p> */}
          </div>
        </div>
        {/* Concepto */}
        <div
          className={`${styles.validation_result_container} relative ${
            results.concept.match
              ? "border-[#09930b] bg-[#2ebd3040]"
              : "border-[#cb3131] bg-[#ec5e5e52]"
          }`}
        >
          <span
            className={`absolute top-1 right-3 text-lg`}
          >
            {results.concept.match ? "✅" : "❌"}
          </span>
          <span
            className={`${styles.validation_heading} ${
              results.concept.match ? "text-[#2c892d]" : "text-[#c63030]"
            }`}
          >
            Concepto
          </span>
          <div className="text-center">
            <p className="text-lg">
              <span className={`${styles.validation_text_bold}`}>
                Ingresado:
              </span>{" "}
              <span className={`${styles.validation_text_italic}`}>
                {results.concept.xml}
              </span>
            </p>
            <p className="text-lg">
              <span className={`${styles.validation_text_bold}`}>
                Esperado:
              </span>{" "}
              <span className={`${styles.validation_text_italic}`}>
                {results.concept.expected}
              </span>
            </p>
            {/* <p className={`text-sm font-bold ${results.concept.match ? 'text-green-600' : 'text-red-500'}`}>
                            {results.concept.match ? '✅ Coincide' : '❌ No coincide'}
                        </p> */}
          </div>
        </div>
        {/* Emisor */}
        <div
          className={`${styles.validation_result_container} relative ${
            results.sender.match
              ? "border-[#09930b] bg-[#2ebd3040]"
              : "border-[#cb3131] bg-[#ec5e5e52]"
          }`}
        >
            <span
            className={`absolute top-1 right-3 text-lg`}
          >
            {results.sender.match ? "✅" : "❌"}
          </span>
          {/* Empresa Emisora */}
          <span
            className={`${styles.validation_heading} ${
              results.sender.match ? "text-[#2c892d]" : "text-[#c63030]"
            }`}
          >
            Empresa Emisora
          </span>
          <div className="text-center">
            <p className="text-lg">
              <span className={`${styles.validation_text_bold}`}>
                Ingresado:
              </span>{" "}
              <span className={`text-base ${styles.validation_text_italic}`}>
                {results.sender.xml}
              </span>
            </p>
            <p className="text-lg">
              <span className={`${styles.validation_text_bold}`}>
                Esperado:
              </span>{" "}
              <span className={`text-base ${styles.validation_text_italic}`}>
                {results.sender.expected}
              </span>
            </p>
            {/* <p className={`text-sm font-bold ${results.sender.match ? 'text-green-600' : 'text-red-500'}`}>
                            {results.sender.match ? '✅ Coincide' : '❌ No coincide'}
                        </p> */}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Este mensaje desaparecerá en {secondsLeft} segundo{secondsLeft === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export default ModalValidationXML;
