import React from 'react';
import { useService } from '../contexts/ServiceContext';
import Header from '../components/layout/Header';
import Pagination from '../components/common/Pagination';
import ServiceProviderCard from '../components/cards/ServiceProviderCard';
import MobileNavigation from '../components/layout/MobileNavigation';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingOverlay from '../components/common/LoadingOverlay';

const SearchResults = ({ onNavigate, onOpenDetails }) => {
  const {
    serviceProviders,
    loading,
    paginationLoading,
    error,
    currentPageNum,
    totalPages,
    totalResults,
    selectedCidade,
    searchProviders,
    goToPage,
    nextPage,
    prevPage,
    clearError
  } = useService();

  const handleSearch = async () => {
    await searchProviders(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={onNavigate} onSearch={handleSearch} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ErrorMessage error={error} onClear={clearError} />
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {totalResults} prestadores encontrados em {selectedCidade}
          </h2>
          <div className="text-gray-600">
            Página {currentPageNum} de {totalPages}
          </div>
        </div>

        {/* Pagination Top */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPageNum}
            totalPages={totalPages}
            onPageChange={goToPage}
            onNext={nextPage}
            onPrev={prevPage}
            loading={paginationLoading}
          />
        )}

        {/* Results Grid */}
        <div className="relative">
          <LoadingOverlay 
            loading={paginationLoading} 
            message={`Carregando página ${currentPageNum}...`} 
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceProviders.map((provider, index) => (
              <ServiceProviderCard
                key={`${provider.cnpj_basico}-${provider.cnpj_ordem}-${provider.cnpj_dv}-${index}`}
                provider={provider}
                index={((currentPageNum - 1) * 10) + index + 1}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        </div>

        {/* Pagination Bottom */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPageNum}
              totalPages={totalPages}
              onPageChange={goToPage}
              onNext={nextPage}
              onPrev={prevPage}
              loading={paginationLoading}
              simple
            />
          </div>
        )}

        {/* Empty State */}
        {serviceProviders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Nenhum prestador encontrado</p>
            <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros ou termos de busca</p>
          </div>
        )}
      </div>

      <MobileNavigation currentPage="search-results" onNavigate={onNavigate} />
    </div>
  );
};

export default SearchResults;