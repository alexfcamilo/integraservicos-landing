import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import SearchResults from '../pages/SearchResults';
import ClaimedProviders from '../pages/ClaimedProviders';
import LikedProviders from '../pages/LikedProviders';
import ServiceDetailsPage from './ServiceDetailsPage';
import LoadingSpinner from './common/LoadingSpinner';

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const openServiceDetails = (provider) => {
    setSelectedProvider(provider);
    setShowServiceDetails(true);
  };

  const closeServiceDetails = () => {
    setShowServiceDetails(false);
    setSelectedProvider(null);
  };

  const openLogin = () => {
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
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
            onNavigate={setCurrentPage}
            onOpenDetails={openServiceDetails}
            onOpenLogin={openLogin}
          />
        );
      case 'search-results':
        return (
          <SearchResults 
            onNavigate={setCurrentPage}
            onOpenDetails={openServiceDetails}
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
            onNavigate={setCurrentPage}
            onOpenDetails={openServiceDetails}
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
            onNavigate={setCurrentPage}
            onOpenDetails={openServiceDetails}
          />
        );
      default:
        return (
          <Dashboard 
            onNavigate={setCurrentPage}
            onOpenDetails={openServiceDetails}
            onOpenLogin={openLogin}
          />
        );
    }
  };

  return (
    <>
      {renderPage()}
      {showServiceDetails && selectedProvider && (
        <ServiceDetailsPage
          serviceProvider={selectedProvider}
          onClose={closeServiceDetails}
          onProviderUpdated={(updatedProvider) => {
            // Propagate update to parent context if needed
            // This will be handled by the ServiceContext
          }}
          isGuest={!isAuthenticated}
        />
      )}
    </>
  );
};

export default AppRouter;