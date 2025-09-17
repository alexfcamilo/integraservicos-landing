import React from 'react';

const ErrorMessage = ({ error, onClear }) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
      {onClear && (
        <button
          onClick={onClear}
          className="text-red-700 hover:text-red-900 font-bold text-xl leading-none"
          title="Fechar"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;