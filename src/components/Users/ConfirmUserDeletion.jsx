
import styles from '../../styles'

const ConfirmUserDeletion = ({ setShowModal, handleUserDeletion}) => {
  return (
    <div className={styles.form_layout}>
      {/* Close Form Button */}
      <button
        onClick={() => setShowModal(false)}
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
          onClick={() => handleUserDeletion()}
          className="px-5 py-2 rounded-xl confirmButton text-white font-medium font-inter shadow-md shadow-green-800/50 hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
        >
          Confirmar
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="px-5 py-2 rounded-xl logoutButton text-white font-medium font-inter shadow-md shadow-red-800/50 hover:cursor-pointer hover:scale-110 hover:font-semibold transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default ConfirmUserDeletion