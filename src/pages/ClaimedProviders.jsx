import React, { useEffect } from 'react';
import { useService } from '../contexts/ServiceContext';
import { useAuth } from '../contexts/AuthContext';
import MobileNavigation from '../components/layout/MobileNavigation';
import ErrorMessage from '../components/common/ErrorMessage';

const ClaimedProviders = ({ onNavigate, onOpenDetails }) => {
  const { logout } = useAuth();
  const { claimedProviders, loading, error, clearError, loadClaimedProviders } = useService();

  useEffect(() => {
    loadClaimedProviders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-800">Minhas Empresas</h1>
            </div>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <ErrorMessage error={error} onClear={clearError} />
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <p className="text-gray-600 mt-4">Carregando suas empresas...</p>
          </div>
        ) : claimedProviders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Você ainda não reivindicou nenhuma empresa</p>
            <p className="text-gray-400 text-sm mt-2">Reivindique empresas para gerenciar suas informações</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {claimedProviders.map(provider => (
              <div key={provider.cnpj_basico} className="bg-white rounded-lg shadow-md p-6 card-hover">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {provider.razao_social}
                  </h3>
                  {provider.verified && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      Verificada
                    </span>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <p><strong>Endereço:</strong> {provider.address || 'Não informado'}</p>
                    <p><strong>Cidade:</strong> {provider.cidade} - {provider.uf}</p>
                  </div>
                  <div>
                    <p><strong>Telefone:</strong> {provider.telefone || 'Não informado'}</p>
                    <p><strong>Email:</strong> {provider.email || 'Não informado'}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-4 text-gray-600">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{provider.like_count} curtidas</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{provider.comment_count} comentários</span>
                    </span>
                  </div>
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition duration-300">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <MobileNavigation currentPage="claimed-providers" onNavigate={onNavigate} />
    </div>
  );
};

export default ClaimedProviders;