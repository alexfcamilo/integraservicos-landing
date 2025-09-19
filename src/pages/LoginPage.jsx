import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

const LoginPage = ({ onClose }) => {
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('login'); // login, register, forgot, reset
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(loginData);
    
    if (result.success) {
      onClose(); // Fecha o modal após login bem-sucedido
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Renderizar diferentes componentes baseado na view atual
  if (currentView === 'register') {
    return (
      <RegisterPage 
        onClose={onClose}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'forgot') {
    return (
      <ForgotPasswordPage 
        onClose={onClose}
        onSwitchToLogin={() => setCurrentView('login')}
        onSwitchToReset={(email) => {
          setResetEmail(email);
          setCurrentView('reset');
        }}
      />
    );
  }

  if (currentView === 'reset') {
    return (
      <ResetPasswordPage 
        onClose={onClose}
        email={resetEmail}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  // View padrão de login
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-800 to-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Login</h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <p className="text-gray-600 mb-6 text-center">Faça login para acessar recursos exclusivos</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Senha
            </label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Entrando...</span>
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          <button
            onClick={() => setCurrentView('forgot')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm block w-full"
          >
            Esqueci minha senha
          </button>
          
          <p className="text-gray-600 text-sm">
            Não tem uma conta?{' '}
            <button 
              onClick={() => setCurrentView('register')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;