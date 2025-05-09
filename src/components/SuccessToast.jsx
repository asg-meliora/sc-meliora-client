import { useEffect } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { motion } from "framer-motion";


const SuccessToast = ({ message, onClose, variant = "text", autoClose = true, duration = 5000 }) => {
  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [autoClose, duration, onClose]);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex items-start gap-4 bg-green-100 border-l-4 border-green-500 text-green-900 p-4 rounded-lg shadow-md max-w-md"
    >
      <FaCheck className="w-6 h-6 mt-1 text-green-600" />
      <div className="flex-1">
        <p className="font-semibold">Éxito</p>
        <p>{message}</p>
      </div>
      {variant === "text" ? (
        <button
          onClick={onClose}
          className="text-green-700 font-semibold hover:underline  hover:cursor-pointer text-sm hover:scale-110 transition-all"
        >
          Cerrar
        </button>
      ) : (
        <button
          onClick={onClose}
          className="text-green-700 font-bold text-xl hover:text-green-900"
        >
          ✕
        </button>
      )}
    </motion.div>
  );
};

export default SuccessToast;
