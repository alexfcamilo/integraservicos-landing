import React from 'react';
import { useService } from '../../contexts/ServiceContext';

const ServiceProviderCard = ({ provider, index, onOpenDetails }) => {
  const { likeProvider } = useService();

  const handleLike = async () => {
    await likeProvider(provider.cnpj_basico);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow card-hover">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-teal-100 to-teal-200">
        <div className="absolute top-3 left-3">
          <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded">
            Prestador
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
            <span className="text-xs font-bold text-gray-800">{index}</span>
          </div>
        </div>
        {provider.is_premium && (
          <div className="absolute bottom-3 left-3 premium-badge">
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-teal-600">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">Foto não disponível</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
          {provider.razao_social}
        </h3>
        
        {provider.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {provider.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded rating-star">
              4.5
            </span>
            <span className="text-gray-600 text-sm">{provider.comment_count} avaliações</span>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors ${
              provider.user_liked ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500`}
          >
            <svg className="w-5 h-5" fill={provider.user_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">{provider.like_count}</span>
          </button>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{provider.cidade}</span>
          </div>
          {provider.telefone_1 && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{provider.telefone_1}</span>
            </div>
          )}
        </div>

        {provider.servicos_prestados && provider.servicos_prestados.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {provider.servicos_prestados.slice(0, 2).map((servico, idx) => (
                <span key={idx} className="tag tag-primary">
                  {servico}
                </span>
              ))}
              {provider.servicos_prestados.length > 2 && (
                <span className="tag tag-secondary">
                  +{provider.servicos_prestados.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        <button 
          onClick={() => onOpenDetails(provider)}
          className="w-full mt-4 btn-primary"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default ServiceProviderCard;