import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';
import Modal from './Modal';
import API_BASE_URL  from '../services/api';

const AccountManagement = ({ isOpen, onClose }) => {
  const { user, logout, checkAuthStatus } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelPremium, setShowCancelPremium] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [loadingUserData, setLoadingUserData] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadUserData();
    }
  }, [isOpen, user]);

  const loadUserData = async () => {
    setLoadingUserData(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('Carregando dados do usuário...');
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('Dados do usuário carregados:', userData);
        setFormData({
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          city: userData.city || '',
          state: userData.state || '',
          email: userData.email || '',
          currentPassword: '',
          newPassword: ''
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao carregar dados:', errorData);
        throw new Error(errorData.error || 'Erro ao carregar dados da conta');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      setError(err.message);
    } finally {
      setLoadingUserData(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar mensagens de erro ao editar
    if (error) setError('');
    if (validationMessage) setValidationMessage('');
  };

  const validatePassword = (password) => {
    if (!password) return true; // Senha nova é opcional
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$&*~]).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSave = async () => {
    setError('');
    setValidationMessage('');

    // Validações
    if (!formData.firstName.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Sobrenome é obrigatório');
      return;
    }
    if (!formData.city.trim()) {
      setError('Cidade é obrigatória');
      return;
    }
    if (!formData.state.trim() || formData.state.length !== 2) {
      setError('Estado deve ter 2 letras (ex: SP)');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('E-mail válido é obrigatório');
      return;
    }
    if (!formData.currentPassword.trim()) {
      setError('Senha atual é obrigatória');
      return;
    }
    if (formData.newPassword && !validatePassword(formData.newPassword)) {
      setValidationMessage('Nova senha deve ter mínimo 6 caracteres, com maiúscula, número e caractere especial');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/update-account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          city: formData.city.trim(),
          state: formData.state.trim().toUpperCase(),
          email: formData.email.trim(),
          currentPassword: formData.currentPassword.trim(),
          newPassword: formData.newPassword.trim() || null
        })
      });

      if (response.ok) {
        setSuccess('Conta atualizada com sucesso!');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        await checkAuthStatus(); // Atualizar dados do usuário no contexto
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao atualizar conta');
      }
    } catch (err) {
      setError('Erro de conexão: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        logout();
        onClose();
        alert('Conta excluída com sucesso!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao excluir conta');
      }
    } catch (err) {
      setError('Erro de conexão: ' + err.message);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelPremium = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/cancel-premium`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess('Plano premium cancelado com sucesso.');
        await checkAuthStatus(); // Atualizar status premium
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao cancelar o plano.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
      setShowCancelPremium(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Conta">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {loadingUserData ? (
            <div className="text-center py-8">
              <LoadingSpinner />
              <p className="text-gray-600 mt-4">Carregando dados da conta...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Nome */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Sobrenome *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Localização */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={2}
                    placeholder="SP"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {/* Senhas */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Alterar Senha</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Senha Atual *
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Nova Senha (opcional)
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    {validationMessage && (
                      <p className="text-red-600 text-sm mt-1">
                        {validationMessage}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      Mínimo 6 caracteres, com maiúscula, número e caractere especial
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col space-y-4 border-t pt-4">
                {/* Botão Salvar */}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Salvando...</span>
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>

                {/* Ações Perigosas */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 text-sm"
                  >
                    Excluir Conta
                  </button>
                  
                  {user?.is_premium && (
                    <button
                      onClick={() => setShowCancelPremium(true)}
                      disabled={loading}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 text-sm"
                    >
                      Cancelar Premium
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal 
        isOpen={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)} 
        title="Confirmar Exclusão de Conta"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="font-semibold text-red-800">Atenção!</h4>
              <p className="text-red-700">Esta ação é irreversível.</p>
            </div>
          </div>
          
          <p className="text-gray-700">
            Tem certeza de que deseja excluir sua conta? Esta ação removerá todos os seus dados, 
            incluindo empresas reivindicadas, curtidas e comentários. 
            {user?.is_premium && ' Seu plano Premium será desativado.'}
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Excluindo...' : 'Excluir Conta'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Confirmação de Cancelamento Premium */}
      <Modal 
        isOpen={showCancelPremium} 
        onClose={() => setShowCancelPremium(false)} 
        title="Cancelar Plano Premium"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Tem certeza de que deseja cancelar seu plano premium? 
            Você perderá todos os benefícios premium, incluindo destaque nos resultados e navegação sem anúncios.
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCancelPremium(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Manter Premium
            </button>
            <button
              onClick={handleCancelPremium}
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Cancelando...' : 'Cancelar Premium'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AccountManagement;