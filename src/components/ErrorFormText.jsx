import { useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles";

const ErrorFormText = ({ message, onClose }) => {
  const duration = 5000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      className={styles.error_message}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      {message}
    </motion.div>
  );
};

export default ErrorFormText;
