import React, { useState } from 'react';
import './index.css';
import Modal from './components/Modal'; // Ajuste o caminho conforme a estrutura do projeto
import { TermsOfUseContent, PrivacyPolicyContent } from './content'; // Ajuste o caminho

function App() {
  const [modalState, setModalState] = useState({ isOpen: false, type: null });

  const openModal = (type) => {
    setModalState({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  return (
    <div className="font-sans bg-blue-900 min-h-screen text-white">
      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.type === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'}
      >
        {modalState.type === 'terms' ? TermsOfUseContent : PrivacyPolicyContent}
      </Modal>

      {/* Cabeçalho */}
      <header className="bg-blue-900 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">ConectaServiços</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#quem-somos" className="hover:text-teal-400">Quem Somos</a></li>
              <li><a href="#objetivo" className="hover:text-teal-400">Objetivo</a></li>
              <li><a href="#como-funciona" className="hover:text-teal-400">Como Funciona</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-900 py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Encontre os Melhores Prestadores em Campo Largo
          </h2>
          <p className="text-lg text-gray-200 mb-6">
            Conectamos clientes e prestadores com avaliações, fotos e contato direto.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.conectaservicos"
            className="bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600"
          >
            Baixe na Google Play
          </a>
        </div>
      </section>

      {/* Quem Somos */}
      <section id="quem-somos" className="py-16 bg-white text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-teal-500 mb-4">Quem Somos</h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Somos uma startup de Campo Largo dedicada a conectar clientes e prestadores de
            serviços de forma prática e segura, trazendo confiança e eficiência.
          </p>
          <div className="mt-6">
            <img src="/icon.png" alt="Ícone de busca de serviços" className="max-w-xs mx-auto" />
          </div>
        </div>
      </section>

      {/* Objetivo */}
      <section id="objetivo" className="py-16 bg-gray-100 text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-teal-500 mb-4">Nosso Objetivo</h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Resolver a dificuldade de encontrar bons prestadores de serviço com uma plataforma
            unificada que oferece avaliações, comentários e informações confiáveis.
          </p>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-16 bg-white text-gray-900">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-teal-500 mb-8 text-center">Como Funciona</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="text-xl font-bold text-blue-900 mb-4">Para Clientes</h4>
              <ul className="list-disc text-gray-700 inline-block text-left">
                <li>Busque serviços no raio desejado</li>
                <li>Escolha empresas com base em avaliações</li>
                <li>Entre em contato diretamente</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h4 className="text-xl font-bold text-blue-900 mb-4">Para Prestadores</h4>
              <ul className="list-disc text-gray-700 inline-block text-left">
                <li>Cadastre sua empresa facilmente</li>
                <li>Divulgue serviços e atraia clientes</li>
                <li>Gerencie agenda e faturamento</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4">Junte-se ao ConectaServiços</h3>
          <p className="text-lg mb-6">
            Baixe agora e conecte-se com os melhores serviços ou divulgue sua empresa!
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.conectaservicos"
            className="bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600"
          >
            Baixe Agora
          </a>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-blue-900 py-6 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">
            <button
              onClick={() => openModal('privacy')}
              className="hover:text-teal-400"
            >
              Política de Privacidade
            </button> |{' '}
            <button
              onClick={() => openModal('terms')}
              className="hover:text-teal-400"
            >
              Termos de Uso
            </button>
          </p>
          <p>Contato: <a href="mailto:suporte@conectaservicos.com" className="hover:text-teal-400">suporte@conectaservicos.com</a></p>
        </div>
      </footer>
    </div>
  );
}

export default App;