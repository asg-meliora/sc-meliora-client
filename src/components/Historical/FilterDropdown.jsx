import { useState, useRef, useEffect } from "react";
import { IoFilter } from "react-icons/io5";

const FilterDropdown = () => {
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef();

  // Cerrar menú si se da clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left font-inter" ref={dropdownRef}>
      {/* Botón */}
      <button
        className="flex items-center gap-2 text-sm p-2 font-semibold text-white rounded-md hover:text-[#eeb13f] hover:cursor-pointer hover:scale-110 transition-all"
        onClick={() => setShowFilters(!showFilters)}
      >
        <IoFilter className="w-4 h-4 fill-current" />
        Filtros
      </button>

      {/* Menú desplegable */}
      {showFilters && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <h4 className="text-gray-800 font-semibold mb-2">Filtros</h4>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">
              Tipo:
              <select className="mt-1 w-full border border-gray-300 rounded-md p-1 text-sm">
                <option>Todos</option>
                <option>Finalizado</option>
                <option>Cancelado</option>
              </select>
            </label>
            <label className="text-sm text-gray-700">
              Fecha:
              <input
                type="date"
                className="mt-1 w-full border border-gray-300 rounded-md p-1 text-sm"
              />
            </label>
            <button
              className="mt-2 updateButton text-[#313131] hover:text-white text-sm font-semibold py-1 px-2 rounded hover:cursor-pointer hover:scale-105 hover:font-bold transition-all"
              onClick={() => {
                // Aplica los filtros aquí
                setShowFilters(false);
              }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
