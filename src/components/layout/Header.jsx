import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useService } from '../../contexts/ServiceContext';
import LoadingSpinner from '../common/LoadingSpinner';
import AccountManagement from '../AccountManagement';
import LocationSelector from './LocationSelector';

const Header = ({ onNavigate, onSearch, onOpenLogin }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { 
    searchTerm, 
    setSearchTerm, 
    loading, 
    loadLikedProviders,
    selectedUf,
    selectedCidade,
    availableLocations,
    estados,
    handleLocationChange
  } = useService();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showMobileLocationModal, setShowMobileLocationModal] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch();
    }
  };

  const handleLikedClick = async () => {
    if (!isAuthenticated) {
      if (onOpenLogin) {
        onOpenLogin();
      }
      return;
    }
    await loadLikedProviders();
    onNavigate('liked-providers');
  };

  const handleAccountManagement = () => {
    setShowUserMenu(false);
    setShowAccountManagement(true);
  };

  const handleLogout = () => {
    console.log('Botão de logout clicado');
    setShowUserMenu(false);
    
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const handleLoginClick = () => {
    if (onOpenLogin) {
      onOpenLogin();
    }
  };

  const handleLocationSelect = (uf, cidade) => {
    handleLocationChange(uf, cidade);
    setShowLocationMenu(false);
  };

  const handleLocationClick = () => {
    if (window.innerWidth < 768) {
      setShowMobileLocationModal(true);
    } else {
      setShowLocationMenu(!showLocationMenu);
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.user-menu-container')) {
      setShowUserMenu(false);
    }
    if (!e.target.closest('.location-menu-container')) {
      setShowLocationMenu(false);
    }
  };

  React.useEffect(() => {
    if (showUserMenu || showLocationMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu, showLocationMenu]);

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-800 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <span className="hidden sm:inline">ConectaServiços</span>
                  <span className="sm:hidden">CS</span>
                </button>
              </div>
              {isAuthenticated && user?.is_premium && (
                <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 px-3 py-1 rounded-full text-sm font-bold">
                  Premium
                </span>
              )}
            </div>

            {/* Seletor de Localização */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative location-menu-container">
                <button
                  onClick={handleLocationClick}
                  className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-xs md:text-sm font-medium text-blue-800"
                >
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline">{selectedCidade}, {selectedUf}</span>
                  <span className="sm:hidden">{selectedUf}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showLocationMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown de Localização - Desktop Only */}
                {showLocationMenu && (
                  <div className="hidden md:block absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">Selecionar Localização</h3>
                      <p className="text-xs text-gray-500">Escolha o estado e cidade para buscar empresas</p>
                    </div>
                    
                    {estados.map((estado) => (
                      <div key={estado.code} className="px-2 py-1">
                        <div className="px-2 py-2 text-sm font-medium text-blue-800 bg-blue-50 rounded">
                          {estado.name} ({estado.code})
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          {availableLocations[estado.code]?.map((cidade) => (
                            <button
                              key={`${estado.code}-${cidade}`}
                              onClick={() => handleLocationSelect(estado.code, cidade)}
                              className={`text-left px-3 py-2 text-sm rounded transition-colors ${
                                selectedUf === estado.code && selectedCidade === cidade
                                  ? 'bg-blue-100 text-blue-800 font-medium'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {cidade}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botão de curtidas */}
              <button
                onClick={handleLikedClick}
                className="text-blue-600 hover:text-blue-800 relative p-2 transition-colors"
                title={isAuthenticated ? "Empresas curtidas" : "Faça login para ver curtidas"}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              {/* Renderização condicional baseada na autenticação */}
              {isAuthenticated ? (
                /* Menu do Usuário Logado */
                <div className="relative user-menu-container">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden lg:block text-left">
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
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center space-x-3"
                        >
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              ) : (
                /* Botão de Login para visitantes */
                <button
                  onClick={handleLoginClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Entrar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Localização Mobile */}
      <LocationSelector 
        isOpen={showMobileLocationModal}
        onClose={() => setShowMobileLocationModal(false)}
      />

      {/* Modal de Gerenciamento de Conta - só renderiza se autenticado */}
      {isAuthenticated && (
        <AccountManagement 
          isOpen={showAccountManagement} 
          onClose={() => setShowAccountManagement(false)} 
        />
      )}
    </>
  );
};

export default Header;