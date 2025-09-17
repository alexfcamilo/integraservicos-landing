import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onNext, 
  onPrev, 
  loading = false,
  simple = false 
}) => {
  if (totalPages <= 1) return null;

  if (simple) {
    return (
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={onPrev}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 bg-teal-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-700 transition duration-300"
        >
          Anterior
        </button>
        <span className="text-gray-600 flex items-center space-x-2">
          <span>Página {currentPage} de {totalPages}</span>
          {loading && <LoadingSpinner size="sm" />}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 bg-teal-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-700 transition duration-300"
        >
          Próxima
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center space-x-4 mb-6">
      <button
        onClick={onPrev}
        disabled={currentPage === 1 || loading}
        className="px-4 py-2 bg-teal-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-700 transition duration-300 flex items-center space-x-2"
      >
        {loading && currentPage > 1 ? (
          <LoadingSpinner size="sm" />
        ) : null}
        <span>Anterior</span>
      </button>
      
      <div className="flex space-x-2">
        {/* Show first page */}
        {currentPage > 3 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={loading}
              className="px-3 py-2 border rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 border-gray-300"
            >
              1
            </button>
            {currentPage > 4 && <span className="px-2 py-2 text-gray-500">...</span>}
          </>
        )}

        {/* Show page numbers around current page */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
          const pageNum = startPage + i;
          
          if (pageNum <= totalPages) {
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`px-3 py-2 border rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  pageNum === currentPage
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'hover:bg-gray-100 border-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          }
          return null;
        })}

        {/* Show last page */}
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && <span className="px-2 py-2 text-gray-500">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={loading}
              className="px-3 py-2 border rounded hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      
      <button
        onClick={onNext}
        disabled={currentPage === totalPages || loading}
        className="px-4 py-2 bg-teal-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-700 transition duration-300 flex items-center space-x-2"
      >
        <span>Próxima</span>
        {loading && currentPage < totalPages ? (
          <LoadingSpinner size="sm" />
        ) : null}
      </button>
    </div>
  );
};

export default Pagination;