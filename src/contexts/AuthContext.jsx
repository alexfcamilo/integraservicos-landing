import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await authAPI.me();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      
      const userData = await authAPI.me();
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Erro ao fazer login' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Novo: Atualizar dados da conta
  const updateAccount = async (accountData) => {
    try {
      const response = await authAPI.updateAccount(accountData);
      
      // Recarregar dados do usuário após atualização
      const updatedUserData = await authAPI.me();
      setUser(updatedUserData);
      
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Erro ao atualizar conta' 
      };
    }
  };

  // Novo: Excluir conta
  const deleteAccount = async () => {
    try {
      await authAPI.deleteAccount();
      
      // Fazer logout após exclusão bem-sucedida
      logout();
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Erro ao excluir conta' 
      };
    }
  };

  // Novo: Cancelar premium
  const cancelPremium = async () => {
    try {
      const response = await authAPI.cancelPremium();
      
      // Recarregar dados do usuário para atualizar status premium
      const updatedUserData = await authAPI.me();
      setUser(updatedUserData);
      
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Erro ao cancelar plano premium' 
      };
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
    updateAccount,
    deleteAccount,
    cancelPremium
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};