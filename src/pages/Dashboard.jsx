import React from 'react';
import { useService } from '../contexts/ServiceContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import SearchSection from '../components/sections/SearchSection';
import ServiceProviderCard from '../components/cards/ServiceProviderCard';
import Pagination from '../components/common/Pagination';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingOverlay from '../components/common/LoadingOverlay';

const Dashboard = ({ onNavigate, onOpenDetails, onOpenLogin }) => {
  const { 
    selectedCidade, 
    selectedUf,
    serviceProviders,
    loading,
    paginationLoading,
    error,
    currentPageNum,
    totalPages,
    totalResults,
    selectedTag,
    searchProviders,
    goToPage,
    nextPage,
    prevPage,
    clearError
  } = useService();

  const handleSearch = async () => {
    // Não navega mais para resultados, mantém na mesma página
    await searchProviders(1);
  };

  const hasResults = serviceProviders.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onNavigate={onNavigate} 
        onSearch={handleSearch} 
        onOpenLogin={onOpenLogin} 
      />
      
      <div className="flex-1">
        <HeroSection onNavigate={onNavigate} />
        
        <SearchSection onSearch={handleSearch} />

        {/* Área de Resultados */}
        {hasResults || loading || error ? (
          <div className="bg-white py-12">
            <div className="max-w-6xl mx-auto px-4">
              <ErrorMessage error={error} onClear={clearError} />
              
              {hasResults && (
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {totalResults} prestadores encontrados em {selectedCidade}
                  </h2>
                  <div className="text-gray-600">
                    Página {currentPageNum} de {totalPages}
                  </div>
                </div>
              )}

              {/* Pagination Top */}
              {totalPages > 1 && hasResults && (
                <div className="mb-6">
                  <Pagination
                    currentPage={currentPageNum}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    onNext={nextPage}
                    onPrev={prevPage}
                    loading={paginationLoading}
                  />
                </div>
              )}

              {/* Results - Single Column */}
              <div className="relative">
                <LoadingOverlay 
                  loading={paginationLoading} 
                  message={`Carregando página ${currentPageNum}...`} 
                />

                {hasResults && (
                  <div className="space-y-6">
                    {serviceProviders.map((provider, index) => (
                      <div 
                        key={`${provider.cnpj_basico}-${provider.cnpj_ordem}-${provider.cnpj_dv}-${index}`}
                        className="max-w-4xl mx-auto"
                      >
                        <ServiceProviderCard
                          provider={provider}
                          index={((currentPageNum - 1) * 10) + index + 1}
                          onOpenDetails={onOpenDetails}
                          onOpenLogin={onOpenLogin}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Loading State */}
                {loading && !hasResults && (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    <p className="text-gray-600 mt-4">Buscando prestadores...</p>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !hasResults && selectedTag && (
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

              {/* Pagination Bottom */}
              {totalPages > 1 && hasResults && (
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
            </div>
          </div>
        ) : (
          /* Welcome state - quando não há busca ativa */
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Encontre prestadores de serviços em {selectedCidade}
              </h3>
              <p className="text-gray-500 mb-4">
                Clique em uma das categorias acima para começar sua busca
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                <span className="inline-block bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full">
                  Pedreiros
                </span>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  Eletricistas
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Encanadores
                </span>
                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  Médicos
                </span>
                <span className="inline-block bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                  Advogados
                </span>
                <span className="inline-block bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-full">
                  E muito mais...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;