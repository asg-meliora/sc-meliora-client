import Cookies from "js-cookie";
import styles from "../../styles";

function AnnulledInvoiceModal({ setCancelShowForm = null, api, invoiceId, setSuccess, setSuccessMessage, setError }) {

    const handleAnnulled = async (e) => {
        console.log("Anulled invoice", invoiceId);
        e.preventDefault();
        try {
            const res = await fetch(`${api}/invoices/user/annulled/${invoiceId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": Cookies.get("token"),
                },
            });
            console.log(res);
            if (!res.ok) throw new Error("Error al subir archivo");

            const result = await res.json();
            setSuccessMessage("Factura anulada exitosamente");
            setSuccess(true);
            // Opcional: refrescar datos
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setCancelShowForm(false); // Cierra el modal después de la acción
            window.location.reload() // TODO: recharge with USestate instead of reload
        }
    };


    return (
        <>
            <div className={styles.form_layout}>
                {/* Close Form Button */}
                <button
                    onClick={() => setCancelShowForm(false)}
                    className={styles.close_form_button}
                >
                    {" "}
                    ✕
                </button>

                {/* Form Title */}
                <h2 className={styles.form_heading}>¿Estás Seguro que quieres anular la factura?</h2>


                <div className="flex justify-center">
                    <button
                        className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow cursor-pointer"
                        onClick={handleAnnulled}
                    >
                        Anular
                    </button>
                </div>



            </div>
        </>
    );
};

export default AnnulledInvoiceModal