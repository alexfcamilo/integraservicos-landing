import React from 'react';
import { useService } from '../contexts/ServiceContext';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import SearchSection from '../components/sections/SearchSection';
import MobileNavigation from '../components/layout/MobileNavigation';

const Dashboard = ({ onNavigate, onOpenDetails }) => {
  const { searchProviders } = useService();

  const handleSearch = async () => {
    const result = await searchProviders(1);
    if (result.success) {
      onNavigate('search-results');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={onNavigate} onSearch={handleSearch} />
      
      <HeroSection onNavigate={onNavigate} />
      
      <SearchSection onSearch={handleSearch} />

      {/* Empty state */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Pronto para buscar?
          </h3>
          <p className="text-gray-500">
            Use os filtros acima para encontrar prestadores de serviços na sua região.
          </p>
        </div>
      </div>

      <MobileNavigation currentPage="dashboard" onNavigate={onNavigate} />
    </div>
  );
};

export default Dashboard;