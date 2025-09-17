import React from 'react';
import { useService } from '../../contexts/ServiceContext';
import LoadingSpinner from '../common/LoadingSpinner';

const SearchSection = ({ onSearch }) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    loading
  } = useService();

  const categories = [
    'Pedreiro', 'Eletricista', 'Encanador', 'Pintor', 'Marceneiro',
    'Mecânico', 'Cabeleireiro', 'Manicure', 'Dentista', 'Advogado',
    'Contador', 'Arquiteto', 'Engenheiro', 'Médico', 'Veterinário'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
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
          <p className="text-gray-300 text-sm mb-4">Selecione uma categoria</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedTag(selectedTag === category ? '' : category)}
                className={`category-btn ${
                  selectedTag === category 
                    ? 'category-btn-active' 
                    : 'category-btn-inactive'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                O que está procurando?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite aqui sua pesquisa..."
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-6 py-2 rounded font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Buscando...</span>
                    </>
                  ) : (
                    'Buscar'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;