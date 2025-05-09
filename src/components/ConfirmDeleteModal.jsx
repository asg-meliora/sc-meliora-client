import styles from "../styles";
import Cookies from "js-cookie";

const ConfirmDeleteModal = ({ setDeleteModalOpen, clientId, api, setSuccess, setSuccessMessage, setError, getClients }) => {
  const handleAnnulled = async () => {
    try {
      const res = await fetch(`${api}/clients/inactive/${clientId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });
      console.log(res);
      if (!res.ok) throw new Error("Error al eliminar el expediente");

      const result = await res.json();
      setSuccessMessage("Expediente elimanado exitosamente");
      setSuccess(true);
      getClients();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setDeleteModalOpen(false);
      // window.location.reload(); // TODO: recharge with USestate instead of reload
    }
  };
  return (
    <div className={styles.form_layout}>
      {/* Close Form Button */}
      <button
        onClick={() => setDeleteModalOpen(false)}
        className={styles.close_form_button}
      >
        ✕
      </button>

      {/* Form Title */}
      <h2 className={`${styles.form_heading} text-center `}>
        Confirmar eliminación
      </h2>

      <div className={`${styles.form} grid grid-cols-2 py-2`}>
        <button
          onClick={() => handleAnnulled()}
          className="px-5 py-2 rounded-xl confirmButton text-white font-medium font-inter shadow-md shadow-green-800/50 hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
        >
          Confirmar
        </button>
        <button
          onClick={() => setDeleteModalOpen(false)}
          className="px-5 py-2 rounded-xl logoutButton text-white font-medium font-inter shadow-md shadow-red-800/50 hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
