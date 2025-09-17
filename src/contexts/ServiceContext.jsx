import React, { createContext, useContext, useState } from 'react';
import { serviceAPI } from '../services/api';

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
      const params = {
        uf: selectedUf,
        cidade: selectedCidade,
        page: page.toString(),
        ...(searchTerm && { search_term: searchTerm }),
        ...(selectedTag && { tag: selectedTag })
      };

      const data = await serviceAPI.searchProviders(params);
      
      setServiceProviders(data.providers || []);
      setTotalResults(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / 10));
      setCurrentPageNum(page);
      
      return { success: true };
    } catch (err) {
      setError('Erro na busca');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
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
    
    // Setters
    setSearchTerm,
    setSelectedUf,
    setSelectedCidade,
    setSelectedTag,
    
    // Ações
    searchProviders,
    loadClaimedProviders,
    loadLikedProviders,
    likeProvider,
    updateProvider,
    goToPage,
    nextPage,
    prevPage,
    clearError
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};