import React from 'react';
import { useService } from '../../contexts/ServiceContext';
import LoadingSpinner from '../common/LoadingSpinner';

const SearchSection = ({ onSearch }) => {
  const {
    selectedTag,
    selectedCidade,
    selectedUf,
    loading,
    searchByTag,
    clearSearch
  } = useService();

  const categories = [
    'Pedreiro', 'Eletricista', 'Encanador', 'Pintor', 'Marceneiro',
    'Mecânico', 'Cabeleireiro', 'Manicure', 'Dentista', 'Advogado',
    'Contador', 'Arquiteto', 'Engenheiro', 'Médico', 'Veterinário'
  ];

  const handleCategoryClick = async (category) => {
    // Se a categoria já está selecionada, desseleciona e limpa busca
    if (selectedTag === category) {
      clearSearch();
      return;
    }

    // Busca automaticamente pela categoria
    const result = await searchByTag(category);
    
    // Se a busca foi bem-sucedida, navega para resultados
    if (result.success && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="bg-gray-50 -mt-16 relative z-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-white text-xl font-semibold mb-4">
            Procurando uma categoria específica?
          </h2>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-300 text-sm">Clique em uma categoria para buscar</p>
            <div className="flex items-center space-x-2 text-gray-300 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Buscando em: <strong className="text-white">{selectedCidade}, {selectedUf}</strong></span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                disabled={loading}
                className={`category-btn transition-all duration-200 ${
                  selectedTag === category 
                    ? 'category-btn-active transform scale-105' 
                    : 'category-btn-inactive'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading && selectedTag === category ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="xs" />
                    <span>{category}</span>
                  </div>
                ) : (
                  category
                )}
              </button>
            ))}
          </div>

          {selectedTag && (
            <div className="mt-4 p-3 bg-teal-600 rounded-lg">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="font-medium">Buscando: {selectedTag}</span>
                </div>
                <button
                  onClick={clearSearch}
                  className="text-white hover:text-gray-200 transition-colors"
                  title="Limpar busca"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              Use o seletor de localização no topo da página para buscar em outras cidades
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;