import React from 'react';
import { useService } from '../contexts/ServiceContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import SearchSection from '../components/sections/SearchSection';

const Dashboard = ({ onNavigate, onOpenDetails, onOpenLogin }) => {
  const { selectedCidade, selectedUf } = useService();

  const handleSearch = async () => {
    // Navega para resultados quando uma busca é realizada
    onNavigate('search-results');
  };

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

        {/* Welcome state */}
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
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;