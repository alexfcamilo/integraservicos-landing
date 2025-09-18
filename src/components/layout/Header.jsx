import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useService } from '../../contexts/ServiceContext';
import LoadingSpinner from '../common/LoadingSpinner';
import AccountManagement from '../AccountManagement';

const Header = ({ onNavigate, onSearch }) => {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm, loading, loadLikedProviders } = useService();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccountManagement, setShowAccountManagement] = useState(false);

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

  const handleAccountManagement = () => {
    setShowUserMenu(false);
    setShowAccountManagement(true);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  // Fechar menu se clicar fora
  const handleClickOutside = (e) => {
    if (!e.target.closest('.user-menu-container')) {
      setShowUserMenu(false);
    }
  };

  React.useEffect(() => {
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <>
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
              
              {/* Menu do Usuário */}
              <div className="relative user-menu-container">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg px-2 py-1"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* Informações do usuário */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user?.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user?.city}, {user?.state}
                      </p>
                      {user?.is_premium && (
                        <span className="inline-block mt-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                          Usuário Premium
                        </span>
                      )}
                    </div>

                    {/* Opções do menu */}
                    <div className="py-1">
                      <button
                        onClick={handleAccountManagement}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="font-medium">Gerenciar Conta</p>
                          <p className="text-xs text-gray-500">Editar dados pessoais e senha</p>
                        </div>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
                      >
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <div>
                          <p className="font-medium">Sair</p>
                          <p className="text-xs text-red-400">Fazer logout da conta</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Gerenciamento de Conta */}
      <AccountManagement 
        isOpen={showAccountManagement} 
        onClose={() => setShowAccountManagement(false)} 
      />
    </>
  );
};

export default Header;