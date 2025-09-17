import React from 'react';
import { useService } from '../../contexts/ServiceContext';

const MobileNavigation = ({ currentPage, onNavigate }) => {
  const { loadClaimedProviders, loadLikedProviders } = useService();

  const handleClaimedClick = async () => {
    await loadClaimedProviders();
    onNavigate('claimed-providers');
  };

  const handleLikedClick = async () => {
    await loadLikedProviders();
    onNavigate('liked-providers');
  };

  const navItems = [
    {
      key: 'dashboard',
      label: 'Buscar',
      icon: (
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      onClick: () => onNavigate('dashboard'),
      isActive: currentPage === 'dashboard' || currentPage === 'search-results'
    },
    {
      key: 'claimed-providers',
      label: 'Minha Empresa',
      icon: (
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      onClick: handleClaimedClick,
      isActive: currentPage === 'claimed-providers'
    },
    {
      key: 'liked-providers',
      label: 'Curtidas',
      icon: (
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      onClick: handleLikedClick,
      isActive: currentPage === 'liked-providers'
    }
  ];

  return (
    <div className="mobile-nav">
      <div className="max-w-6xl mx-auto flex justify-center space-x-8">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={item.onClick}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              item.isActive
                ? 'text-teal-600 bg-teal-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;