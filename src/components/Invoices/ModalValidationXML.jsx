import React, { useEffect, useState } from 'react';
import styles from '../../styles';

function ModalValidationXML({ results, onClose }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            onClose?.(); // Llama a función de cierre si se pasó por props
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className={`${styles.form_layout}`}>
            <h2 className="text-xl font-semibold mb-4 text-center">Resultado de validaciones</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                    <span className="text-gray-700 font-medium">Subtotal</span>
                    <div className="text-right">
                        <p className="text-sm">
                            XML: <span className="font-mono">{results.subtotal.xml}</span>
                        </p>
                        <p className="text-sm">
                            Esperado: <span className="font-mono">{results.subtotal.expected}</span>
                        </p>
                        <p className={`text-sm font-bold ${results.subtotal.match ? 'text-green-600' : 'text-red-500'}`}>
                            {results.subtotal.match ? '✅ Coincide' : '❌ No coincide'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                    <span className="text-gray-700 font-medium">IVA</span>
                    <div className="text-right">
                        <p className="text-sm">
                            XML: <span className="font-mono">{results.iva.xml}</span>
                        </p>
                        <p className="text-sm">
                            Esperado: <span className="font-mono">{results.iva.expected}</span>
                        </p>
                        <p className={`text-sm font-bold ${results.iva.match ? 'text-green-600' : 'text-red-500'}`}>
                            {results.iva.match ? '✅ Coincide' : '❌ No coincide'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                    <span className="text-gray-700 font-medium">Concepto</span>
                    <div className="text-right">
                        <p className="text-sm">
                            XML: <span className="font-mono">{results.concept.xml}</span>
                        </p>
                        <p className="text-sm">
                            Esperado: <span className="font-mono">{results.concept.expected}</span>
                        </p>
                        <p className={`text-sm font-bold ${results.concept.match ? 'text-green-600' : 'text-red-500'}`}>
                            {results.concept.match ? '✅ Coincide' : '❌ No coincide'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
                    <span className="text-gray-700 font-medium">Empresa Emisora</span>
                    <div className="text-right">
                        <p className="text-sm">
                            XML: <span className="font-mono">{results.sender.xml}</span>
                        </p>
                        <p className="text-sm">
                            Esperado: <span className="font-mono">{results.sender.expected}</span>
                        </p>
                        <p className={`text-sm font-bold ${results.sender.match ? 'text-green-600' : 'text-red-500'}`}>
                            {results.sender.match ? '✅ Coincide' : '❌ No coincide'}
                        </p>
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">Este mensaje desaparecerá en 10 segundos</p>
        </div>
    );
};

export default ModalValidationXML