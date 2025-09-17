import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({ loading, message = 'Carregando...' }) => {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
      <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg shadow-lg">
        <LoadingSpinner size="lg" />
        <span className="text-teal-600 font-medium">{message}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;