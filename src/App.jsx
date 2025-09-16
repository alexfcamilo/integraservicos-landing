import React, { useState, useEffect } from 'react';
import './index.css';

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

    // Para nova busca (página 1), usar loading geral; para navegação, usar paginationLoading
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
        // Atualizar o estado local dos provedores
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

  // Página de Login
  if (!isAuthenticated) {
    return (
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
  }

  // Dashboard Principal
  if (currentPage === 'dashboard') {
    return (
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
                className={`py-4 px-2 border-b-2 ${currentPage === 'dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
              >
                Buscar
              </button>
              <button
                onClick={loadClaimedProviders}
                className="py-4 px-2 border-b-2 border-transparent hover:text-blue-600"
              >
                Minhas Empresas
              </button>
              <button
                onClick={loadLikedProviders}
                className="py-4 px-2 border-b-2 border-transparent hover:text-blue-600"
              >
                Curtidas
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Encontre Prestadores de Serviços
            </h2>

            {/* Localização */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Localização</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Busca */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Buscar por nome ou descrição
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o nome da empresa ou tipo de serviço..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Ou escolha uma categoria
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {quickFilters.map(filter => (
                      <button
                        key={filter}
                        onClick={() => setSelectedTag(selectedTag === filter ? '' : filter)}
                        className={`px-3 py-2 rounded-lg text-sm transition duration-300 ${
                          selectedTag === filter
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => searchProviders(1)} // Sempre começar na página 1 para nova busca
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
                >
                  {loading ? 'Buscando...' : 'Buscar Prestadores'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Resultados da Busca
  if (currentPage === 'search-results') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-blue-900 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">ConectaServiços</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition duration-300"
              >
                Nova Busca
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

        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Resultados da Busca ({totalResults})
            </h2>
            
            {/* Informações da página atual */}
            <div className="text-gray-600">
              Página {currentPageNum} de {totalPages}
            </div>
          </div>

          {/* Controles de paginação - Topo */}
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
                {/* Primeira página */}
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
                
                {/* Páginas próximas à atual */}
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
                
                {/* Última página */}
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

          {/* Overlay de loading sobre os resultados durante paginação */}
          <div className="relative">
            {paginationLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-600 font-medium">Carregando página {currentPageNum}...</span>
                </div>
              </div>
            )}

            <div className="grid gap-6">
            {serviceProviders.map((provider, index) => (
              <div key={`${provider.cnpj_basico}-${provider.cnpj_ordem}-${provider.cnpj_dv}-${index}`} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    {provider.is_premium && (
                      <div className="text-blue-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-800">
                      {provider.razao_social}
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => likeProvider(provider.cnpj_basico)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded transition duration-300 ${
                      provider.user_liked
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={provider.user_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{provider.like_count}</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <p><strong>CNPJ:</strong> {provider.cnpj_basico}-{provider.cnpj_ordem}-{provider.cnpj_dv}</p>
                    <p><strong>Cidade:</strong> {provider.cidade}</p>
                    <p><strong>Telefone:</strong> {provider.telefone_1 || 'Não informado'}</p>
                  </div>
                  <div>
                    <p><strong>Email:</strong> {provider.correio_eletronico || 'Não informado'}</p>
                    <p><strong>Comentários:</strong> {provider.comment_count}</p>
                    <p><strong>Página:</strong> {currentPageNum}</p>
                  </div>
                </div>

                {provider.description && (
                  <div className="mt-4">
                    <p><strong>Descrição:</strong> {provider.description}</p>
                  </div>
                )}

                {provider.servicos_prestados && provider.servicos_prestados.length > 0 && (
                  <div className="mt-4">
                    <p><strong>Serviços:</strong></p>
                    <ul className="list-disc list-inside text-gray-600">
                      {provider.servicos_prestados.map((servico, index) => (
                        <li key={index}>{servico}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>

          {/* Controles de paginação - Rodapé */}
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
              <p className="text-gray-500 text-lg">Nenhum prestador encontrado</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Empresas Reivindicadas
  if (currentPage === 'claimed-providers') {
    return (
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
  }

  // Empresas Curtidas
  if (currentPage === 'liked-providers') {
    return (
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
  }

  return null;
}

export default App;