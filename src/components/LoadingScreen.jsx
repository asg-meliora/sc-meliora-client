import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75 mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Cargando información...
        </p>
      </motion.div>
    </>
  );
};

export default LoadingScreen;
