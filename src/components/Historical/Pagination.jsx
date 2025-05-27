import React from "react";

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  handlePageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Mostrar todas las páginas si son 5 o menos
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar paginación truncada
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, "...");
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          "...",
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
          "..."
        );
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <>
      <div className="flex justify-end items-end space-x-4 text-[#37383b] text-lg font-inter mr-[2vw]">
        <button
          className="hover:cursor-pointer hover:scale-130 hover:font-semibold transition-all duration-100"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          &#60;
        </button>
        {/*Manejo de Paginacion, y manejo de una condicional para mostrar 0, si no existen datos */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-1 select-none">
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => setCurrentPage(page)}
              className={` ${
                page === currentPage ? "font-bold text-[#c09945]" : "hover:cursor-pointer hover:scale-130 hover:font-semibold transition-all duration-100"
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          className="hover:cursor-pointer hover:scale-130 hover:font-semibold transition-all duration-100"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          &#62;
        </button>
      </div>
    </>
  );
};

export default Pagination;
