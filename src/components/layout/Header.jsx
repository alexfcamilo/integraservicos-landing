import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useService } from '../../contexts/ServiceContext';
import LoadingSpinner from '../common/LoadingSpinner';

const Header = ({ onNavigate, onSearch }) => {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm, loading, loadLikedProviders } = useService();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch();
    }
  };

  const handleLikedClick = async () => {
    await loadLikedProviders();
    onNavigate('liked-providers');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-xl font-bold text-gray-800 hover:text-teal-600 transition-colors"
              >
                ConectaServiços
              </button>
            </div>
            {user?.is_premium && (
              <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                Premium
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLikedClick}
              className="text-gray-600 hover:text-gray-800 relative"
              title="Empresas curtidas"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm hidden md:block">{user?.first_name}</span>
              </button>
            </div>
            
            <button
              onClick={logout}
              className="text-gray-600 hover:text-red-600 transition-colors"
              title="Sair"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;