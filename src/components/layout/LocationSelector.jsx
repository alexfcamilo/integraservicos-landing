import React from 'react';
import { useService } from '../../contexts/ServiceContext';

const LocationSelector = ({ isOpen, onClose }) => {
  const {
    selectedUf,
    selectedCidade,
    availableLocations,
    estados,
    handleLocationChange
  } = useService();

  const handleLocationSelect = (uf, cidade) => {
    handleLocationChange(uf, cidade);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Selecionar Localização</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <p className="text-sm text-gray-600 mb-4">
            Escolha o estado e cidade para buscar empresas
          </p>
          
          {estados.map((estado) => (
            <div key={estado.code} className="mb-4">
              <div className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded mb-2">
                {estado.name} ({estado.code})
              </div>
              <div className="space-y-1">
                {availableLocations[estado.code]?.map((cidade) => (
                  <button
                    key={`${estado.code}-${cidade}`}
                    onClick={() => handleLocationSelect(estado.code, cidade)}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      selectedUf === estado.code && selectedCidade === cidade
                        ? 'bg-teal-100 text-teal-800 font-medium'
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Localização atual:</span>
            <span className="font-medium text-gray-900">
              {selectedCidade}, {selectedUf}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;