import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import styles from "../../styles";
import { MdOutlineCancel } from "react-icons/md";


function HistoricalMobile({ sortedData, selectedIds, setSelectedIds, handleCancelledForm, FormattedDate, formatCurrency, statusColor }) {
    return (
        <div className="block lg:hidden space-y-4 px-2 py-4">
            {sortedData.map((item) => (
                <div
                    key={item.pipeline_id}
                    className="bg-[#1f1f1f] text-white rounded-xl shadow-lg p-4 space-y-2 border border-[#4e4e4e]"
                >
                    <div className="flex justify-between"><span className="font-bold">ID:</span><span>{item.pipeline_id}</span></div>
                    <div className="flex justify-between"><span className="font-bold">Tipo:</span><span>{item.type_pipeline}</span></div>
                    <div className="flex justify-between"><span className="font-bold">Usuario:</span><span>{item.assigned_user_sender}</span></div>
                    <div className="flex justify-between"><span className="font-bold">Concepto:</span><span>{item.concept}</span></div>
                    <div className="flex justify-between"><span className="font-bold">Fecha:</span><span>{FormattedDate(item.created_at)}</span></div>
                    <div className="flex justify-between"><span className="font-bold">Subtotal:</span><span>{formatCurrency(item.subtotal)}</span></div>
                    <div className="flex justify-between"><span className="font-bold">IVA:</span><span>{formatCurrency(item.iva)}</span></div>
                    <div className="flex justify-between"><span className="font-bold">Total:</span><span>{formatCurrency(item.total_refund)}</span></div>
                    <div className="flex justify-between"><span className="font-bold">Receptor:</span><span>{item.receiver_name_rs}</span></div>
                    <div className="flex justify-between">
                        <span className="font-bold">Estatus:</span>
                        <span className={`px-2 py-1 text-xs rounded-full text-white ${statusColor[item.status] || "bg-gray-400"}`}>
                            {item.status || "Desconocido"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        {item.status !== "Anulado" && (
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(item.pipeline_id)}
                                    onChange={(e) => {
                                        setSelectedIds((prev) =>
                                            e.target.checked
                                                ? [...prev, item.pipeline_id]
                                                : prev.filter((id) => id !== item.pipeline_id)
                                        );
                                    }}
                                    className="w-5 h-5 accent-yellow-500"
                                />
                                Seleccionar
                            </label>
                        )}
                        {item.status !== "Anulado" && item.status !== "Cancelada" && (
                            <button
                                onClick={() => handleCancelledForm(item.pipeline_id)}
                                className="text-[#eeb13f] hover:text-white transition-transform hover:scale-110"
                            >
                                Cancelar <MdOutlineCancel size={18} className="inline ml-1" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default HistoricalMobile