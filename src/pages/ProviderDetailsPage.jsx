import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useService } from '../contexts/ServiceContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import API_BASE_URL  from '../../services/api';

const ProviderDetailsPage = ({ provider, onNavigate, onOpenLogin }) => {
  const { isAuthenticated, user } = useAuth();
  const { likeProvider } = useService();
  const [currentProvider, setCurrentProvider] = useState(provider);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (provider) {
      fetchProviderDetails();
      if (isAuthenticated) {
        fetchComments();
      }
    }
  }, [provider, isAuthenticated]);

  const fetchProviderDetails = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/provider/${provider.cnpj_basico}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentProvider(data);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/provider-comments/${provider.cnpj_basico}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      onOpenLogin();
      return;
    }

    try {
      await likeProvider(currentProvider.cnpj_basico);
      setCurrentProvider(prev => ({
        ...prev,
        user_liked: !prev.user_liked,
        like_count: prev.user_liked ? prev.like_count - 1 : prev.like_count + 1
      }));
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  const addComment = async () => {
    if (!isAuthenticated) {
      onOpenLogin();
      return;
    }

    if (!newComment.trim() || newComment.length > 200) {
      alert('O comentário deve ter entre 1 e 200 caracteres');
      return;
    }

    setIsCommentLoading(true);
    try {
      const token = localStorage.getItem('token');
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

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setCurrentProvider(prev => ({
          ...prev,
          comment_count: prev.comment_count + 1
        }));
        setNewComment('');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setIsCommentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
    setShowPhotoModal(true);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copiado!`);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header onNavigate={onNavigate} onOpenLogin={onOpenLogin} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onNavigate={onNavigate} onOpenLogin={onOpenLogin} />
      
      <div className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="hover:text-blue-600 transition-colors"
              >
                Início
              </button>
              <span>›</span>
              <span className="text-gray-900 font-medium truncate">
                {currentProvider.razao_social}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Header com Imagem de Fundo */}
        <div className="relative h-80 overflow-hidden">
          {/* Imagem de fundo */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: currentProvider.photos && currentProvider.photos.length > 0 
                ? `url(${currentProvider.photos[0].url.startsWith('http') ? currentProvider.photos[0].url : `${API_BASE_URL}/${currentProvider.photos[0].url}`})`
                : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          {/* Conteúdo do Header */}
          <div className="relative z-10 h-full flex items-end">
            <div className="max-w-6xl mx-auto px-4 py-8 w-full">
              <div className="grid lg:grid-cols-3 gap-8 items-end">
                
                {/* Informações da Empresa */}
                <div className="lg:col-span-2">
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 text-white text-sm mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{currentProvider.cidade} - {currentProvider.uf}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <h1 className="text-3xl md:text-4xl font-bold text-white">
                        {currentProvider.razao_social}
                      </h1>
                      {currentProvider.is_premium && (
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>PREMIUM</span>
                        </span>
                      )}
                    </div>

                    {currentProvider.servicos_prestados && currentProvider.servicos_prestados.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {currentProvider.servicos_prestados.slice(0, 3).map((servico, idx) => (
                          <span key={idx} className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium">
                            {servico}
                          </span>
                        ))}
                        {currentProvider.servicos_prestados.length > 3 && (
                          <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium">
                            +{currentProvider.servicos_prestados.length - 3} serviços
                          </span>
                        )}
                      </div>
                    )}

                    {/* Rating e Like */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="bg-emerald-600 text-white text-sm font-bold px-2 py-1 rounded">
                          4.5
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-white text-sm">
                          {currentProvider.comment_count} avaliações
                        </span>
                      </div>

                      <button
                        onClick={handleLike}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full border-2 transition-colors ${
                          currentProvider.user_liked
                            ? 'border-red-400 bg-red-500 text-white'
                            : 'border-white bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={currentProvider.user_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm font-medium">{currentProvider.like_count}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Carousel de Imagens */}
                {currentProvider.photos && currentProvider.photos.length > 0 && (
                  <div className="lg:col-span-1">
                    <div className="relative">
                      {/* Container do Carousel */}
                      <div className="relative w-full h-48 bg-black bg-opacity-20 rounded-lg overflow-hidden">
                        <img
                          src={currentProvider.photos[selectedPhotoIndex]?.url.startsWith('http') 
                            ? currentProvider.photos[selectedPhotoIndex]?.url 
                            : `${API_BASE_URL}/${currentProvider.photos[selectedPhotoIndex]?.url}`}
                          alt={currentProvider.photos[selectedPhotoIndex]?.caption || `Foto ${selectedPhotoIndex + 1}`}
                          className="w-full h-full object-cover"
                          onClick={() => setShowPhotoModal(true)}
                        />
                        
                        {/* Overlay de clique */}
                        <div 
                          className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all cursor-pointer flex items-center justify-center"
                          onClick={() => setShowPhotoModal(true)}
                        >
                          <svg className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>

                        {/* Navegação do Carousel */}
                        {currentProvider.photos.length > 1 && (
                          <>
                            <button
                              onClick={() => setSelectedPhotoIndex(selectedPhotoIndex === 0 ? currentProvider.photos.length - 1 : selectedPhotoIndex - 1)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setSelectedPhotoIndex(selectedPhotoIndex === currentProvider.photos.length - 1 ? 0 : selectedPhotoIndex + 1)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}

                        {/* Indicadores de posição */}
                        {currentProvider.photos.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                            {currentProvider.photos.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedPhotoIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === selectedPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Contador de fotos */}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          {selectedPhotoIndex + 1}/{currentProvider.photos.length}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Sobre a Empresa */}
              {currentProvider.description && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Sobre a empresa</h3>
                  <p className="text-gray-700 leading-relaxed">{currentProvider.description}</p>
                </div>
              )}

              {/* Serviços */}
              {currentProvider.servicos_prestados && currentProvider.servicos_prestados.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Todos os Serviços Oferecidos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentProvider.servicos_prestados.map((servico, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{servico}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comentários */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Avaliações ({comments.length})
                </h3>

                {/* Adicionar Comentário */}
                {isAuthenticated ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Deixe sua avaliação</h4>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      maxLength={200}
                      rows={3}
                      placeholder="Compartilhe sua experiência com esta empresa..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">{newComment.length}/200</span>
                      <button
                        onClick={addComment}
                        disabled={isCommentLoading || !newComment.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCommentLoading ? 'Enviando...' : 'Publicar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-center">
                      <button
                        onClick={onOpenLogin}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Faça login
                      </button>
                      {' '}para deixar sua avaliação
                    </p>
                  </div>
                )}

                {/* Lista de Comentários */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Ainda não há avaliações para esta empresa.</p>
                  ) : (
                    comments.map((comment, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {comment.first_name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {comment.first_name} {comment.last_name}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar de Contato */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Informações de Contato</h3>
                
                <div className="space-y-4">
                  {/* Endereço */}
                  {currentProvider.address && currentProvider.address !== 'Não informado' && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 mb-1">Endereço</p>
                            <p className="font-medium text-gray-900 leading-tight">{currentProvider.address}</p>
                            <p className="text-sm text-gray-600 mt-1">{currentProvider.cidade} - {currentProvider.uf}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(currentProvider.address, 'Endereço')}
                          className="text-gray-600 hover:text-gray-700 p-1 flex-shrink-0"
                          title="Copiar endereço"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Telefone */}
                  {currentProvider.telefone_1 && currentProvider.telefone_1 !== 'Não informado' && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600">Telefone</p>
                            <p className="font-medium text-gray-900">{currentProvider.telefone_1}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(currentProvider.telefone_1, 'Telefone')}
                          className="text-green-600 hover:text-green-700 p-1 flex-shrink-0"
                          title="Copiar telefone"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {currentProvider.correio_eletronico && currentProvider.correio_eletronico !== 'Não informado' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600">E-mail</p>
                            <p className="font-medium text-gray-900 break-all">{currentProvider.correio_eletronico}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(currentProvider.correio_eletronico, 'E-mail')}
                          className="text-blue-600 hover:text-blue-700 p-1 flex-shrink-0"
                          title="Copiar e-mail"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="mt-6 space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300">
                    Solicitar Orçamento
                  </button>
                  <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition duration-300">
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal de Foto */}
      {showPhotoModal && currentProvider.photos && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setShowPhotoModal(false)}>
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
            >
              ×
            </button>
            <img
              src={currentProvider.photos[selectedPhotoIndex]?.url.startsWith('http') 
                ? currentProvider.photos[selectedPhotoIndex]?.url 
                : `${API_BASE_URL}/${currentProvider.photos[selectedPhotoIndex]?.url}`}
              alt={currentProvider.photos[selectedPhotoIndex]?.caption}
              className="max-w-full max-h-full object-contain"
            />
            {currentProvider.photos[selectedPhotoIndex]?.caption && (
              <div className="text-white text-center mt-4 text-lg">
                {currentProvider.photos[selectedPhotoIndex]?.caption}
              </div>
            )}
            <div className="text-white text-center mt-2">
              {selectedPhotoIndex + 1} de {currentProvider.photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDetailsPage;