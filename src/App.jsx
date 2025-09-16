import React, { useState, useEffect } from 'react';
import './index.css';
import ServiceDetailsPage from './ServiceDetailsPage';

const API_BASE_URL = 'http://localhost:3000'; // Ajuste conforme necessário

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [claimedProviders, setClaimedProviders] = useState([]);
  const [likedProviders, setLikedProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados de paginação
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  // Estados do formulário de login
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  // Estados de busca
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUf, setSelectedUf] = useState('PR');
  const [selectedCidade, setSelectedCidade] = useState('Campo Largo');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);

  const openServiceDetails = (provider) => {
    console.log('Opening details for provider:', provider);
    setSelectedProvider(provider);
    setShowServiceDetails(true);
    console.log('showServiceDetails set to:', true);
    console.log('selectedProvider set to:', provider);
  };

  const closeServiceDetails = () => {
    setShowServiceDetails(false);
    setSelectedProvider(null);
  };
  
  // Verificar token ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkTokenAndLoadUser(token);
    }
  }, []);

  const checkTokenAndLoadUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      localStorage.removeItem('token');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        await checkTokenAndLoadUser(data.token);
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('login');
    setServiceProviders([]);
    setClaimedProviders([]);
    setLikedProviders([]);
  };

  const searchProviders = async (page = 1) => {
    if (!searchTerm && !selectedTag) {
      setError('Informe um termo de busca ou selecione uma categoria');
      return;
    }

    if (page === 1) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }
    setError('');

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        uf: selectedUf,
        cidade: selectedCidade,
        page: page.toString()
      });

      if (searchTerm) params.append('search_term', searchTerm);
      if (selectedTag) params.append('tag', selectedTag);

      const url = `${API_BASE_URL}/search-service-providers?${params}`;

      const response = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      const data = await response.json();

      if (response.ok) {
        setServiceProviders(data.providers || []);
        setTotalResults(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / 10));
        setCurrentPageNum(page);
        setCurrentPage('search-results');
      } else {
        setError(data.error || 'Erro na busca');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPageNum && !paginationLoading) {
      searchProviders(page);
    }
  };

  const nextPage = () => {
    if (currentPageNum < totalPages && !paginationLoading) {
      goToPage(currentPageNum + 1);
    }
  };

  const prevPage = () => {
    if (currentPageNum > 1 && !paginationLoading) {
      goToPage(currentPageNum - 1);
    }
  };

  const loadClaimedProviders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/my-claimed-providers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setClaimedProviders(data);
        setCurrentPage('claimed-providers');
      } else {
        setError('Erro ao carregar empresas reivindicadas');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const loadLikedProviders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/my-liked-providers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setLikedProviders(data);
        setCurrentPage('liked-providers');
      } else {
        setError('Erro ao carregar empresas curtidas');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const likeProvider = async (cnpjBasico) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/like-provider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cnpj_basico: cnpjBasico })
      });

      if (response.ok) {
        const data = await response.json();
        setServiceProviders(prev => prev.map(provider => 
          provider.cnpj_basico === cnpjBasico 
            ? { 
                ...provider, 
                user_liked: data.action === 'added',
                like_count: data.action === 'added' 
                  ? provider.like_count + 1 
                  : provider.like_count - 1
              }
            : provider
        ));
      }
    } catch (err) {
      setError('Erro ao curtir empresa');
    }
  };

  const quickFilters = [
    'Pedreiro', 'Eletricista', 'Encanador', 'Pintor', 'Marceneiro',
    'Mecânico', 'Cabeleireiro', 'Manicure', 'Dentista', 'Advogado',
    'Contador', 'Arquiteto', 'Engenheiro', 'Médico', 'Veterinário'
  ];

  console.log('App render - showServiceDetails:', showServiceDetails, 'selectedProvider:', selectedProvider);

  let mainContent = null;

  if (!isAuthenticated) {
    mainContent = (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">ConectaServiços</h1>
            <p className="text-gray-600">Faça login para acessar a plataforma</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">E-mail</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    );
  } else if (currentPage === 'dashboard' || currentPage === 'search-results') {
    mainContent = (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-blue-900 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">ConectaServiços</h1>
              {user?.is_premium && (
                <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                  Premium
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span>Olá, {user?.first_name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition duration-300"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`py-4 px-2 border-b-2 ${currentPage === 'dashboard' || currentPage === 'search-results' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
              >
                Buscar
              </button>
              <button
                onClick={loadClaimedProviders}
                className={`py-4 px-2 border-b-2 ${currentPage === 'claimed-providers' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-blue-600'}`}
              >
                Minhas Empresas
              </button>
              <button
                onClick={loadLikedProviders}
                className={`py-4 px-2 border-b-2 ${currentPage === 'liked-providers' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-blue-600'}`}
              >
                Curtidas
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {currentPage === 'dashboard' ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Encontre Prestadores de Serviços
              </h2>
              <div className="flex gap-6">
                {/* Sidebar de Filtros */}
                <div className="w-80 space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Localização</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
                        <select
                          value={selectedUf}
                          onChange={(e) => setSelectedUf(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PR">Paraná</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Cidade</label>
                        <select
                          value={selectedCidade}
                          onChange={(e) => setSelectedCidade(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Campo Largo">Campo Largo</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Buscar</h3>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Nome ou descrição
                      </label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite aqui..."
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Categorias</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {quickFilters.map(filter => (
                        <button
                          key={filter}
                          onClick={() => setSelectedTag(selectedTag === filter ? '' : filter)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition duration-300 ${
                            selectedTag === filter
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => searchProviders(1)}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Buscando...' : 'Buscar Prestadores'}
                  </button>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-md p-8 min-h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Pronto para buscar?
                      </h3>
                      <p className="text-gray-500">
                        Use os filtros ao lado para encontrar prestadores de serviços na sua região.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-6">
                <div className="w-80 space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Localização</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
                        <select
                          value={selectedUf}
                          onChange={(e) => setSelectedUf(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PR">Paraná</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Cidade</label>
                        <select
                          value={selectedCidade}
                          onChange={(e) => setSelectedCidade(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Campo Largo">Campo Largo</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Buscar</h3>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Nome ou descrição
                      </label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite aqui..."
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Categorias</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {quickFilters.map(filter => (
                        <button
                          key={filter}
                          onClick={() => setSelectedTag(selectedTag === filter ? '' : filter)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition duration-300 ${
                            selectedTag === filter
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => searchProviders(1)}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Buscando...' : 'Buscar Prestadores'}
                  </button>
                </div>
                <div className="flex-1">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {totalResults} resultados encontrados
                    </h2>
                    <div className="text-gray-600">
                      Página {currentPageNum} de {totalPages}
                    </div>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mb-6">
                      <button
                        onClick={prevPage}
                        disabled={currentPageNum === 1 || paginationLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
                      >
                        {paginationLoading && currentPageNum > 1 ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : null}
                        <span>Anterior</span>
                      </button>
                      <div className="flex space-x-2">
                        {currentPageNum > 3 && (
                          <>
                            <button
                              onClick={() => goToPage(1)}
                              disabled={paginationLoading}
                              className="px-3 py-2 border rounded hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              1
                            </button>
                            {currentPageNum > 4 && <span className="px-2 py-2">...</span>}
                          </>
                        )}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const startPage = Math.max(1, Math.min(currentPageNum - 2, totalPages - 4));
                          const pageNum = startPage + i;
                          if (pageNum <= totalPages) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                disabled={paginationLoading}
                                className={`px-3 py-2 border rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 ${
                                  pageNum === currentPageNum
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-gray-100'
                                }`}
                              >
                                {paginationLoading && pageNum !== currentPageNum ? (
                                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : null}
                                <span>{pageNum}</span>
                              </button>
                            );
                          }
                          return null;
                        })}
                        {currentPageNum < totalPages - 2 && (
                          <>
                            {currentPageNum < totalPages - 3 && <span className="px-2 py-2">...</span>}
                            <button
                              onClick={() => goToPage(totalPages)}
                              disabled={paginationLoading}
                              className="px-3 py-2 border rounded hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>
                      <button
                        onClick={nextPage}
                        disabled={currentPageNum === totalPages || paginationLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
                      >
                        <span>Próxima</span>
                        {paginationLoading && currentPageNum < totalPages ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : null}
                      </button>
                    </div>
                  )}
                  <div className="relative">
                    {paginationLoading && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-blue-600 font-medium">Carregando página {currentPageNum}...</span>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {serviceProviders.map((provider, index) => (
                        <div key={`${provider.cnpj_basico}-${provider.cnpj_ordem}-${provider.cnpj_dv}-${index}`} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-2 flex-1">
                              {provider.is_premium && (
                                <div className="text-amber-500">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </div>
                              )}
                              <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                                {provider.razao_social}
                              </h3>
                            </div>
                            <button
                              onClick={() => likeProvider(provider.cnpj_basico)}
                              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition duration-300 ${
                                provider.user_liked
                                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <svg className="w-4 h-4" fill={provider.user_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span className="text-sm">{provider.like_count}</span>
                            </button>
                          </div>
                          <div className="space-y-3 text-gray-600 text-sm">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span><strong>CNPJ:</strong> {provider.cnpj_basico}-{provider.cnpj_ordem}-{provider.cnpj_dv}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span><strong>Cidade:</strong> {provider.cidade}</span>
                            </div>
                            {provider.telefone_1 && (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span><strong>Telefone:</strong> {provider.telefone_1}</span>
                              </div>
                            )}
                            {provider.correio_eletronico && (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span><strong>Email:</strong> {provider.correio_eletronico}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-4 text-xs">
                              <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{provider.comment_count} comentários</span>
                              </div>
                            </div>
                          </div>
                          {provider.description && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700 line-clamp-3">{provider.description}</p>
                            </div>
                          )}
                          {provider.servicos_prestados && provider.servicos_prestados.length > 0 && (
                            <div className="mt-4">
                              <div className="flex flex-wrap gap-2">
                                {provider.servicos_prestados.slice(0, 3).map((servico, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {servico}
                                  </span>
                                ))}
                                {provider.servicos_prestados.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{provider.servicos_prestados.length - 3} mais
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Página {currentPageNum}</span>
                            </div>
                            <button 
                              onClick={() => openServiceDetails(provider)}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                              Ver Detalhes
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-8">
                      <button
                        onClick={prevPage}
                        disabled={currentPageNum === 1 || paginationLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
                      >
                        {paginationLoading && currentPageNum > 1 ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : null}
                        <span>Anterior</span>
                      </button>
                      <span className="text-gray-600 flex items-center space-x-2">
                        <span>Página {currentPageNum} de {totalPages}</span>
                        {paginationLoading && (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </span>
                      <button
                        onClick={nextPage}
                        disabled={currentPageNum === totalPages || paginationLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
                      >
                        <span>Próxima</span>
                        {paginationLoading && currentPageNum < totalPages ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : null}
                      </button>
                    </div>
                  )}
                  {serviceProviders.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">Nenhum prestador encontrado</p>
                      <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros ou termos de busca</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    );
  } else if (currentPage === 'claimed-providers') {
    mainContent = (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-900 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Minhas Empresas</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition duration-300"
              >
                Voltar
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition duration-300"
              >
                Sair
              </button>
            </div>
          </div>
        </header>
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`py-4 px-2 border-b-2 ${currentPage === 'dashboard' || currentPage === 'search-results' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
              >
                Buscar
              </button>
              <button
                onClick={loadClaimedProviders}
                className={`py-4 px-2 border-b-2 ${currentPage === 'claimed-providers' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-blue-600'}`}
              >
                Minhas Empresas
              </button>
              <button
                onClick={loadLikedProviders}
                className={`py-4 px-2 border-b-2 ${currentPage === 'liked-providers' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-blue-600'}`}
              >
                Curtidas
              </button>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {claimedProviders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Você ainda não reivindicou nenhuma empresa</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {claimedProviders.map(provider => (
                <div key={provider.cnpj_basico} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {provider.razao_social}
                    </h3>
                    {provider.verified && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        Verificada
                      </span>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                    <div>
                      <p><strong>Endereço:</strong> {provider.address || 'Não informado'}</p>
                      <p><strong>Cidade:</strong> {provider.cidade} - {provider.uf}</p>
                    </div>
                    <div>
                      <p><strong>Telefone:</strong> {provider.telefone || 'Não informado'}</p>
                      <p><strong>Email:</strong> {provider.email || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-4 text-gray-600">
                      <span>{provider.like_count} curtidas</span>
                      <span>{provider.comment_count} comentários</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  } else if (currentPage === 'liked-providers') {
    mainContent = (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-900 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Empresas Curtidas</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition duration-300"
              >
                Voltar
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition duration-300"
              >
                Sair
              </button>
            </div>
          </div>
        </header>
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`py-4 px-2 border-b-2 ${currentPage === 'dashboard' || currentPage === 'search-results' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
              >
                Buscar
              </button>
              <button
                onClick={loadClaimedProviders}
                className={`py-4 px-2 border-b-2 ${currentPage === 'claimed-providers' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-blue-600'}`}
              >
                Minhas Empresas
              </button>
              <button
                onClick={loadLikedProviders}
                className={`py-4 px-2 border-b-2 ${currentPage === 'liked-providers' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-blue-600'}`}
              >
                Curtidas
              </button>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {likedProviders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Você ainda não curtiu nenhuma empresa</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {likedProviders.map(provider => (
                <div key={provider.cnpj_basico} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {provider.razao_social}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                    <div>
                      <p><strong>Cidade:</strong> {provider.cidade}</p>
                      <p><strong>Telefone:</strong> {provider.telefone || 'Não informado'}</p>
                    </div>
                    <div>
                      <p><strong>Email:</strong> {provider.email || 'Não informado'}</p>
                      <p><strong>Comentários:</strong> {provider.comment_count}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-red-600 flex items-center space-x-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{provider.like_count} curtidas</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  } else {
    mainContent = null;
  }

  return (
    <>
      {mainContent}
      {showServiceDetails && selectedProvider && (
        <ServiceDetailsPage
          serviceProvider={selectedProvider}
          onClose={closeServiceDetails}
          onProviderUpdated={(updatedProvider) => {
            setServiceProviders((prev) =>
              prev.map((p) =>
                p.cnpj_basico === updatedProvider.cnpj_basico ? updatedProvider : p
              )
            );
          }}
          isGuest={!isAuthenticated}
        />
      )}
    </>
  );
}

export default App;