import { useEffect } from "react";
import { IoAlertCircleOutline, IoReload } from "react-icons/io5";
import { motion } from "framer-motion";

const ErrorToast = ({ message, onClose, variant = "text", autoClose = true, duration = 5000 }) => {
  const handleReload = () => {
    window.location.reload();
  };
  
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
    className="flex items-start gap-4 bg-red-100 border-l-4 border-red-500 text-red-900 p-4 rounded-lg shadow-md max-w-md"
    >
        <IoAlertCircleOutline className="w-6 h-6 mt-1 text-red-600" />
        <div className="flex-1">
          <p className="font-semibold">Error</p>
          <p>{message}</p>
          <button
            onClick={handleReload}
            className="mt-2 flex items-center gap-2 text-red-700 hover:underline text-sm"
          >
            <IoReload className="w-4 h-4" />
            Recargar página
          </button>
        </div>
        {variant === "text" ? (
          <button
            onClick={onClose}
            className="text-red-700 font-semibold hover:underline"
          >
            Cerrar
          </button>
        ) : (
          <button
            onClick={onClose}
            className="text-red-700 font-bold text-xl hover:text-red-900"
          >
            ✕
          </button>
        )}
    </motion.div>
  );
};

export default ErrorToast;
