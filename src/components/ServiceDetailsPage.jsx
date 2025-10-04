import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const ServiceDetailsPage = ({ 
  serviceProvider, 
  onClose, 
  onProviderUpdated,
  isGuest = false 
}) => {
  console.log('ServiceDetailsPage rendered with provider:', serviceProvider);
  const [currentProvider, setCurrentProvider] = useState(serviceProvider);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchProviderDetails();
    if (!isGuest) {
      fetchComments();
      checkOwnership();
    }
  }, []);

  const getToken = async () => {
    return localStorage.getItem('token');
  };

  const fetchProviderDetails = async () => {
    const token = await getToken();
    if (!token) {
      console.log('No token found for provider details');
      return;
    }

    console.log('Fetching provider details for CNPJ:', currentProvider.cnpj_basico);
    try {
      const response = await fetch(`${API_BASE_URL}/provider/${currentProvider.cnpj_basico}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Provider details response:', response.status, response.statusText);
      if (response.ok) {
        const data = await response.json();
        console.log('Provider details data:', data);
        setCurrentProvider(data);
      } else {
        console.log('Failed to fetch provider details:', response.status);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    }
  };

  const fetchComments = async () => {
    setIsCommentLoading(true);
    const token = await getToken();
    if (!token) {
      console.log('No token found for comments');
      setIsCommentLoading(false);
      return;
    }

    console.log('Fetching comments for CNPJ:', currentProvider.cnpj_basico);
    try {
      const response = await fetch(`${API_BASE_URL}/provider-comments/${currentProvider.cnpj_basico}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Comments response:', response.status, response.statusText);
      if (response.ok) {
        const data = await response.json();
        console.log('Comments data:', data);
        setComments(data);
      } else {
        console.log('Failed to fetch comments:', response.status);
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setIsCommentLoading(false);
    }
  };

  const checkOwnership = async () => {
    const token = await getToken();
    if (!token) {
      console.log('No token found for ownership check');
      return;
    }

    console.log('Checking ownership for CNPJ:', currentProvider.cnpj_basico);
    try {
      const response = await fetch(`${API_BASE_URL}/my-claimed-providers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Ownership response:', response.status, response.statusText);
      if (response.ok) {
        const claimedProviders = await response.json();
        console.log('Claimed providers:', claimedProviders);
        const isOwned = claimedProviders.some(
          p => p.cnpj_basico === currentProvider.cnpj_basico && p.verified
        );
        setIsOwner(isOwned);
        console.log('Is owner:', isOwned);
      } else {
        console.log('Failed to fetch claimed providers:', response.status);
      }
    } catch (error) {
      console.error('Erro ao verificar propriedade:', error);
    }
  };

  const likeProvider = async () => {
    if (isGuest) {
      alert('Faça login para usar esta funcionalidade');
      return;
    }

    const token = await getToken();
    if (!token) {
      console.log('No token found for liking provider');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/like-provider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cnpj_basico: currentProvider.cnpj_basico })
      });
      console.log('Like provider response:', response.status, response.statusText);
      if (response.ok) {
        const data = await response.json();
        console.log('Like provider data:', data);
        const updatedProvider = {
          ...currentProvider,
          user_liked: data.action === 'added',
          like_count: data.action === 'added' ? currentProvider.like_count + 1 : currentProvider.like_count - 1
        };
        setCurrentProvider(updatedProvider);
        if (onProviderUpdated) {
          onProviderUpdated(updatedProvider);
        }
      } else {
        console.log('Failed to like provider:', response.status);
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  const addComment = async () => {
    if (isGuest) {
      alert('Faça login para comentar');
      return;
    }

    if (!newComment.trim() || newComment.length > 200) {
      alert('O comentário deve ter entre 1 e 200 caracteres');
      return;
    }

    const token = await getToken();
    if (!token) {
      console.log('No token found for adding comment');
      return;
    }

    setIsCommentLoading(true);
    console.log('Adding comment for CNPJ:', currentProvider.cnpj_basico, 'Comment:', newComment.trim());
    try {
      const response = await fetch(`${API_BASE_URL}/add-provider-comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cnpj_basico: currentProvider.cnpj_basico,
          comment: newComment.trim()
        })
      });
      console.log('Add comment response:', response.status, response.statusText);
      if (response.ok) {
        const data = await response.json();
        console.log('Add comment data:', data);
        setComments(prev => [data.comment, ...prev]);
        const updatedProvider = {
          ...currentProvider,
          comment_count: currentProvider.comment_count + 1
        };
        setCurrentProvider(updatedProvider);
        setNewComment('');
        if (onProviderUpdated) {
          onProviderUpdated(updatedProvider);
        }
      } else {
        console.log('Failed to add comment:', response.status);
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setIsCommentLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copiado!`);
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3 py-2">
      <div className="text-blue-600">{icon}</div>
      <div className="flex-1">
        <span className="font-medium">{label}:</span>{' '}
        <span className="text-gray-700">{value || 'Não informado'}</span>
      </div>
      {value && value !== 'Não informado' && (
        <button
          onClick={() => copyToClipboard(value, label)}
          className="text-gray-400 hover:text-gray-600 p-1"
          title={`Copiar ${label}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      )}
    </div>
  );

  const PhotoGallery = () => {
    if (!currentProvider.photos || currentProvider.photos.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Fotos</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentProvider.photos.map((photo, index) => (
            <div key={index} className="relative group cursor-pointer">
              <img
                src={photo.url.startsWith('http') ? photo.url : `${API_BASE_URL}/${photo.url}`}
                alt={photo.caption || `Foto ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                onClick={() => setSelectedPhotoIndex(index)}
              />
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg">
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PhotoModal = () => {
    if (selectedPhotoIndex === null) return null;

    const photo = currentProvider.photos[selectedPhotoIndex];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setSelectedPhotoIndex(null)}>
        <div className="relative max-w-4xl max-h-full p-4">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            ×
          </button>
          <img
            src={photo.url.startsWith('http') ? photo.url : `${API_BASE_URL}/${photo.url}`}
            alt={photo.caption}
            className="max-w-full max-h-full object-contain"
          />
          {photo.caption && (
            <div className="text-white text-center mt-4 text-lg">
              {photo.caption}
            </div>
          )}
          <div className="text-white text-center mt-2">
            {selectedPhotoIndex + 1} de {currentProvider.photos.length}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div className="flex items-center space-x-3">
            {currentProvider.is_premium && (
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
            <h2 className="text-2xl font-bold text-gray-800">{currentProvider.razao_social}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Informações de Contato</span>
            </h3>
            
            <div className="space-y-2">
              <InfoRow 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                label="Endereço"
                value={currentProvider.address}
              />
              <InfoRow 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                label="Cidade/UF"
                value={`${currentProvider.cidade || 'Não informado'} - ${currentProvider.uf || 'Não informado'}`}
              />
              <InfoRow 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                label="Telefone"
                value={currentProvider.telefone_1 || currentProvider.telefone}
              />
              <InfoRow 
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                label="E-mail"
                value={currentProvider.correio_eletronico || currentProvider.email}
              />
            </div>
          </div>

          {/* Services Description */}
          {(currentProvider.description || (currentProvider.servicos_prestados && currentProvider.servicos_prestados.length > 0)) && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Serviços Prestados</span>
              </h3>
              
              {currentProvider.description ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{currentProvider.description}</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {currentProvider.servicos_prestados.map((servico, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-700">{servico}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {isOwner && currentProvider.tags && currentProvider.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Tipo de Atividade</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentProvider.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full border border-teal-200"
                  >
                    {tag.replace(/[{}"]/g, '').trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          <PhotoGallery />

          {/* Like and Comment Stats */}
          <div className="flex items-center space-x-6 mb-6 pb-4 border-b border-gray-200">
            <button
              onClick={likeProvider}
              disabled={isGuest || (currentProvider.verified && isOwner)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                currentProvider.user_liked
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${(isGuest || (currentProvider.verified && isOwner)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg 
                className="w-5 h-5" 
                fill={currentProvider.user_liked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{currentProvider.like_count} curtida{currentProvider.like_count !== 1 ? 's' : ''}</span>
            </button>

            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{currentProvider.comment_count} comentário{currentProvider.comment_count !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Comentários</span>
            </h3>

            {/* Add Comment */}
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={200}
                rows={3}
                placeholder={isGuest ? 'Faça login para comentar' : 'Adicionar comentário...'}
                disabled={isGuest}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">{newComment.length}/200</span>
                {!isGuest && (
                  <button
                    onClick={addComment}
                    disabled={isCommentLoading || !newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCommentLoading ? 'Enviando...' : 'Comentar'}
                  </button>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {isCommentLoading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum comentário ainda.</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 mb-2">{comment.comment}</p>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{comment.first_name} {comment.last_name}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(comment.created_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <PhotoModal />
    </div>
  );
};

export default ServiceDetailsPage;