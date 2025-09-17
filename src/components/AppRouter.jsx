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

  const openServiceDetails = (provider) => {
    setSelectedProvider(provider);
    setShowServiceDetails(true);
  };

  const closeServiceDetails = () => {
    setShowServiceDetails(false);
    setSelectedProvider(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={setCurrentPage}
            onOpenDetails={openServiceDetails}
          />
        );
      case 'search-results':
        return (
          <SearchResults 
            onNavigate={setCurrentPage}
            onOpenDetails={openServiceDetails}
          />
        );
      case 'claimed-providers':
        return (
          <ClaimedProviders 
            onNavigate={setCurrentPage}
            onOpenDetails={openServiceDetails}
          />
        );
      case 'liked-providers':
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