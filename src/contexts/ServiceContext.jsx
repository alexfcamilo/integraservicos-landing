import React, { createContext, useContext, useState } from 'react';
import serviceAPI from '../services/api';

const ServiceContext = createContext();

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};

export const ServiceProvider = ({ children }) => {
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
  
  // Estados de busca
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUf, setSelectedUf] = useState('PR');
  const [selectedCidade, setSelectedCidade] = useState('Campo Largo');
  const [selectedTag, setSelectedTag] = useState('');

  // Cidades disponíveis por estado (expandir conforme necessário)
  const availableLocations = {
    'PR': [
      'Campo Largo'
    ]
  };

  const estados = [
    { code: 'PR', name: 'Paraná' }
  ];

  const handleLocationChange = (newUf, newCidade = null) => {
    setSelectedUf(newUf);
    
    // Se uma cidade específica foi selecionada, usar ela
    // Senão, usar a primeira cidade disponível para o estado
    if (newCidade) {
      setSelectedCidade(newCidade);
    } else {
      const firstCity = availableLocations[newUf]?.[0] || 'Campo Largo';
      setSelectedCidade(firstCity);
    }
    
    // Reset pagination
    setCurrentPageNum(1);
  };

  // Função de busca atualizada - permite busca apenas por tag
  const searchProviders = async (page = 1, forceTag = null) => {
    // Use a tag forçada se fornecida, senão use a tag selecionada
    const tagToSearch = forceTag || selectedTag;
    
    // Agora permite busca apenas por tag OU por termo de busca
    if (!searchTerm && !tagToSearch) {
      setError('Selecione uma categoria para buscar');
      return { success: false, error: 'Selecione uma categoria para buscar' };
    }

    if (page === 1) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }
    setError('');

    try {
      const params = {
        uf: selectedUf,
        cidade: selectedCidade,
        page: page.toString(),
        ...(searchTerm && { search_term: searchTerm }),
        ...(tagToSearch && { tag: tagToSearch })
      };

      console.log('📤 Params enviados para API:', params);

      const data = await serviceAPI.searchProviders(params);

      console.log('📥 Resposta da API:', data);
      
      setServiceProviders(data.providers || []);
      setTotalResults(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / 10));
      setCurrentPageNum(page);
      
      return { success: true };
    } catch (err) {

      console.error('❌ Erro na busca:', err);
      setError('Erro na busca: ' + err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  // Função para busca automática por tag
  const searchByTag = async (tag) => {
    setSelectedTag(tag);
    setCurrentPageNum(1);
    return await searchProviders(1, tag);
  };

  const loadClaimedProviders = async () => {
    setLoading(true);
    try {
      const data = await serviceAPI.getClaimedProviders();
      setClaimedProviders(data);
      return { success: true };
    } catch (err) {
      setError('Erro ao carregar empresas reivindicadas');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loadLikedProviders = async () => {
    setLoading(true);
    try {
      const data = await serviceAPI.getLikedProviders();
      setLikedProviders(data);
      return { success: true };
    } catch (err) {
      setError('Erro ao carregar empresas curtidas');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const likeProvider = async (cnpjBasico) => {
    try {
      const data = await serviceAPI.likeProvider(cnpjBasico);
      
      // Atualizar estado local
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
      
      return { success: true, data };
    } catch (err) {
      setError('Erro ao curtir empresa');
      return { success: false, error: err.message };
    }
  };

  const updateProvider = (updatedProvider) => {
    setServiceProviders(prev => prev.map(provider =>
      provider.cnpj_basico === updatedProvider.cnpj_basico 
        ? updatedProvider 
        : provider
    ));
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

  const clearError = () => setError('');

  // Função para limpar busca
  const clearSearch = () => {
    setSelectedTag('');
    setSearchTerm('');
    setServiceProviders([]);
    setTotalResults(0);
    setTotalPages(1);
    setCurrentPageNum(1);
    setError('');
  };

  const value = {
    // Estados
    serviceProviders,
    claimedProviders,
    likedProviders,
    loading,
    paginationLoading,
    error,
    currentPageNum,
    totalPages,
    totalResults,
    searchTerm,
    selectedUf,
    selectedCidade,
    selectedTag,
    availableLocations,
    estados,
    
    // Setters
    setSearchTerm,
    setSelectedUf,
    setSelectedCidade,
    setSelectedTag,
    handleLocationChange,
    
    // Ações
    searchProviders,
    searchByTag,
    loadClaimedProviders,
    loadLikedProviders,
    likeProvider,
    updateProvider,
    goToPage,
    nextPage,
    prevPage,
    clearError,
    clearSearch
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};