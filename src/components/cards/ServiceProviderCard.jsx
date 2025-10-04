import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useService } from '../../contexts/ServiceContext';
import { API_BASE_URL } from '../../services/api';

const ServiceProviderCard = ({ provider, index, onOpenDetails, onOpenLogin }) => {
  const { isAuthenticated } = useAuth();
  const { likeProvider } = useService();

  const handleLike = async () => {
    if (!isAuthenticated) {
      if (onOpenLogin) {
        onOpenLogin();
      } else {
        alert('Faça login para curtir empresas');
      }
      return;
    }
    await likeProvider(provider.cnpj_basico);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow card-hover service-provider-card">
      <div className="flex flex-col sm:flex-row">
        {/* Área da imagem - QUADRADA */}
        <div className="w-full sm:w-44 sm:h-44 md:w-48 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 relative image-container company-image-placeholder">
          {provider.photos && provider.photos.length > 0 ? (
            <img
              src={provider.photos[0].url.startsWith('http') ? provider.photos[0].url : `${API_BASE_URL}/${provider.photos[0].url}`}
              alt={provider.razao_social}
              className="company-image"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Sem foto</span>
              </div>
            </div>
          )}
          
          {/* Número do resultado sobreposto na imagem */}
          <div className="absolute top-2 left-2 bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
            {index}
          </div>
          
          {/* Premium badge sobreposto na imagem */}
          {provider.is_premium && (
            <div className="absolute top-2 right-2 premium-badge bg-white rounded-full p-1 shadow-md">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
        </div>

        {/* Conteúdo do card */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 text-xl mb-2">
              {provider.razao_social}
            </h3>
            {provider.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {provider.description}
              </p>
            )}
          </div>

          {/* Informações de contato e localização em grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 text-sm text-gray-800">
              {/* Endereço Completo */}
              {provider.address && provider.address !== 'Não informado' && (
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="leading-tight">{provider.address}</p>
                    <p className="text-sm text-gray-1000 mt-1">{provider.cidade} - {provider.uf}</p>
                  </div>
                </div>
              )}
              
              {/* Cidade/UF quando não há endereço completo */}
              {(!provider.address || provider.address === 'Não informado') && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{provider.cidade} - {provider.uf}</span>
                </div>
              )}
              
              {provider.telefone_1 && provider.telefone_1 !== 'Não informado' && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{provider.telefone_1}</span>
                </div>
              )}
              
              {provider.correio_eletronico && provider.correio_eletronico !== 'Não informado' && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{provider.correio_eletronico}</span>
                </div>
              )}
            </div>

            {/* Estatísticas e ações */}
            <div className="flex flex-col justify-between">
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
                    isAuthenticated && provider.user_liked ? 'text-red-500' : 'text-gray-400'
                  } hover:text-red-500`}
                  title={!isAuthenticated ? 'Faça login para curtir' : ''}
                >
                  <svg className="w-5 h-5" fill={isAuthenticated && provider.user_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm">{provider.like_count}</span>
                </button>
              </div>

              <button 
                onClick={() => onOpenDetails(provider)}
                className="w-full btn-primary"
              >
                Ver Detalhes
              </button>
            </div>
          </div>

          {/* Serviços prestados */}
          {provider.servicos_prestados && provider.servicos_prestados.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Serviços:</h4>
              <div className="flex flex-wrap gap-2">
                {provider.servicos_prestados.slice(0, 3).map((servico, idx) => (
                  <span key={idx} className="tag tag-primary">
                    {servico}
                  </span>
                ))}
                {provider.servicos_prestados.length > 3 && (
                  <span className="tag tag-secondary">
                    +{provider.servicos_prestados.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderCard;