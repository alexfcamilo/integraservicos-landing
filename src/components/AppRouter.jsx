import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import SearchResults from '../pages/SearchResults';
import ClaimedProviders from '../pages/ClaimedProviders';
import LikedProviders from '../pages/LikedProviders';
import ProviderDetailsPage from '../pages/ProviderDetailsPage';
import LoadingSpinner from './common/LoadingSpinner';

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const openProviderDetails = (provider) => {
    setSelectedProvider(provider);
    setCurrentPage('provider-details');
  };

  const openLogin = () => {
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page !== 'provider-details') {
      setSelectedProvider(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="text-gray-600 mt-4 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o modal de login estiver aberto, mostrar ele
  if (showLogin && !isAuthenticated) {
    return <LoginPage onClose={closeLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={handleNavigate}
            onOpenDetails={openProviderDetails}
            onOpenLogin={openLogin}
          />
        );
      case 'search-results':
        return (
          <SearchResults 
            onNavigate={handleNavigate}
            onOpenDetails={openProviderDetails}
            onOpenLogin={openLogin}
          />
        );
      case 'claimed-providers':
        if (!isAuthenticated) {
          setCurrentPage('dashboard');
          setShowLogin(true);
          return null;
        }
        return (
          <ClaimedProviders 
            onNavigate={handleNavigate}
            onOpenDetails={openProviderDetails}
          />
        );
      case 'liked-providers':
        if (!isAuthenticated) {
          setCurrentPage('dashboard');
          setShowLogin(true);
          return null;
        }
        return (
          <LikedProviders 
            onNavigate={handleNavigate}
            onOpenDetails={openProviderDetails}
          />
        );
      case 'provider-details':
        if (!selectedProvider) {
          setCurrentPage('dashboard');
          return null;
        }
        return (
          <ProviderDetailsPage
            provider={selectedProvider}
            onNavigate={handleNavigate}
            onOpenLogin={openLogin}
          />
        );
      default:
        return (
          <Dashboard 
            onNavigate={handleNavigate}
            onOpenDetails={openProviderDetails}
            onOpenLogin={openLogin}
          />
        );
    }
  };

  return renderPage();
};

export default AppRouter;