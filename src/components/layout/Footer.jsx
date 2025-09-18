import React, { useState } from 'react';
import Modal from '../Modal';

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const TermsContent = () => (
    <div className="prose prose-sm max-w-none">
      <h3 className="text-xl font-bold text-teal-500 mb-4">Termos de Uso do ConectaServiços</h3>
      <p className="text-sm text-gray-500 italic mb-4">Última atualização: 15 de junho de 2025</p>
      
      <p className="mb-4">
        Estes Termos de Uso ("Termos") regulam o acesso e uso da plataforma ConectaServiços. 
        Ao utilizar o aplicativo, o Usuário declara que leu, compreendeu e concorda com estes 
        Termos e com a Política de Privacidade da plataforma.
      </p>

      <h4 className="text-lg font-bold mb-2">1. Objeto e Funcionalidade do Aplicativo</h4>
      <p className="mb-4">
        O ConectaServiços é uma plataforma digital de acesso público que disponibiliza dados 
        cadastrais de empresas brasileiras e permite, de forma colaborativa, agregar informações 
        por seus usuários em relação a serviços contratados. O objetivo é facilitar o contato 
        entre consumidores e prestadores de serviço, promovendo uma base de contas comerciais 
        atualizadas e segmentadas por nichos.
      </p>

      <h4 className="text-lg font-bold mb-2">2. Capacidade para Cadastramento</h4>
      <ul className="list-disc list-inside mb-4">
        <li>O uso do aplicativo está restrito a pessoas físicas maiores de 18 anos e 
        juridicamente capazes, bem como a representantes legais de pessoas jurídicas 
        devidamente constituídas.</li>
        <li>O ConectaServiços poderá recusar, suspender ou cancelar cadastros a seu 
        exclusivo critério, especialmente em casos de uso indevido ou tentativa de fraude.</li>
      </ul>

      <h4 className="text-lg font-bold mb-2">3. Regras de Uso e Responsabilidades do Usuário</h4>
      <div className="mb-4">
        <h5 className="font-semibold">3.1. Cadastro</h5>
        <ul className="list-disc list-inside ml-4">
          <li>O Usuário se compromete a fornecer informações verdadeiras, completas e atualizadas.</li>
          <li>O uso de identidade falsa ou informações de terceiros sem autorização é estritamente proibido.</li>
        </ul>
        
        <h5 className="font-semibold mt-2">3.2. Edição de Dados Empresariais</h5>
        <ul className="list-disc list-inside ml-4">
          <li>O Usuário poderá editar informações como telefone, endereço, fotos e outras descrições da empresa.</li>
          <li>Informações públicas oficiais só poderão ser alteradas mediante comprovação de vínculo com a empresa.</li>
          <li>Dados inseridos poderão passar por moderação manual e ser excluídos se considerados falsos, ofensivos, ilegais ou incompatíveis.</li>
        </ul>

        <h5 className="font-semibold mt-2">3.3. Condutas Proibidas</h5>
        <p>É expressamente proibido:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Usar o app para finalidades ilegais, ofensivas, discriminatórias ou que violem direitos de terceiros.</li>
          <li>Praticar spam, fraudes, adulterar ou deturpar informações de empresas.</li>
          <li>Reivindicar falsamente o controle de estabelecimentos.</li>
          <li>Usar automações (bots, scripts etc.) para modificar informações ou interagir com o app.</li>
        </ul>
      </div>

      <h4 className="text-lg font-bold mb-2">4. Responsabilidades da Plataforma</h4>
      <p className="mb-4">
        O ConectaServiços atua como plataforma informacional, não participando de negócios e 
        não fornecendo qualquer garantia em relação a clientes e empresas. Não garantimos a 
        veracidade, atualização ou legalidade dos dados inseridos por terceiros.
      </p>

      <h4 className="text-lg font-bold mb-2">5. Legislação Aplicável e Foro</h4>
      <p className="mb-4">
        Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o 
        foro da Comarca de Campo Largo - PR para dirimir quaisquer controvérsias.
      </p>

      <h4 className="text-lg font-bold mb-2">6. Contato</h4>
      <p>
        Em caso de dúvida, denúncias ou solicitações, entre em contato conosco pelo e-mail:{' '}
        <a href="mailto:suporte@conectaservicos.com" className="text-teal-500 hover:text-teal-600">
          suporte@conectaservicos.com
        </a>
      </p>
    </div>
  );

  const PrivacyContent = () => (
    <div className="prose prose-sm max-w-none">
      <h3 className="text-xl font-bold text-teal-500 mb-4">Política de Privacidade do ConectaServiços</h3>
      <p className="text-sm text-gray-500 italic mb-4">Última atualização: 15 de junho de 2025</p>
      
      <p className="mb-4">
        Esta Política de Privacidade descreve como coletamos, usamos, armazenamos, compartilhamos 
        e protegemos suas informações, de acordo com a Lei Geral de Proteção de Dados 
        (LGPD - Lei nº 13.709/2018).
      </p>

      <h4 className="text-lg font-bold mb-2">1. Dados que Coletamos</h4>
      <div className="mb-4">
        <h5 className="font-semibold">Dados Públicos de Empresas:</h5>
        <p className="ml-4">Informações obtidas de fontes oficiais, como Receita Federal, incluindo nome, CNPJ, serviço, telefone e descrição de serviços.</p>
        
        <h5 className="font-semibold">Dados Fornecidos por Usuários:</h5>
        <ul className="list-disc list-inside ml-4">
          <li>Informações de cadastro: nome, e-mail, telefone e, opcionalmente, CPF ou CNPJ</li>
          <li>Contribuições: alterações como atualizações de telefone, endereço, fotos</li>
          <li>Dados de avaliação: avaliações de prestadores</li>
        </ul>

        <h5 className="font-semibold">Dados Coletados Automaticamente:</h5>
        <ul className="list-disc list-inside ml-4">
          <li>Localização aproximada (com consentimento)</li>
          <li>Informações do dispositivo</li>
          <li>Registros de uso do aplicativo</li>
        </ul>
      </div>

      <h4 className="text-lg font-bold mb-2">2. Finalidade do Tratamento</h4>
      <ul className="list-disc list-inside mb-4">
        <li>Criar e gerenciar contas na plataforma</li>
        <li>Identificar o usuário e personalizar a experiência</li>
        <li>Sugerir empresas próximas</li>
        <li>Melhorar os resultados de busca</li>
        <li>Corrigir erros e aprimorar a navegação</li>
        <li>Garantir a segurança do app</li>
      </ul>

      <h4 className="text-lg font-bold mb-2">3. Compartilhamento de Dados</h4>
      <ul className="list-disc list-inside mb-4">
        <li>Dados editados por usuários são exibidos publicamente no app</li>
        <li>Dados pessoais não são vendidos ou compartilhados com terceiros para fins comerciais</li>
        <li>Compartilhamos apenas com provedores de serviços sob contratos de proteção</li>
        <li>Quando exigido por lei ou ordem judicial</li>
      </ul>

      <h4 className="text-lg font-bold mb-2">4. Seus Direitos</h4>
      <p className="mb-2">Nos termos da LGPD, você tem os seguintes direitos:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Acessar, corrigir ou atualizar seus dados pessoais</li>
        <li>Solicitar a exclusão de sua conta e dos dados pessoais</li>
        <li>Revogar consentimento para uso de dados opcionais</li>
        <li>Obter informações sobre o tratamento de seus dados</li>
      </ul>

      <h4 className="text-lg font-bold mb-2">5. Segurança</h4>
      <p className="mb-4">
        Adotamos medidas técnicas e organizacionais robustas para proteger seus dados, incluindo 
        criptografia para transmissão (HTTPS) e armazenamento seguro (AES-256).
      </p>

      <h4 className="text-lg font-bold mb-2">6. Contato</h4>
      <p>
        Para dúvidas sobre dados pessoais e privacidade, entre em contato com nosso 
        suporte, pelo e-mail{' '}
        <a href="mailto:suporte@conectaservicos.com" className="text-teal-500 hover:text-teal-600">
          suporte@conectaservicos.com
        </a>
      </p>
    </div>
  );

  return (
    <>
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Logo e Descrição */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">ConectaServiços</span>
              </div>
              <p className="text-gray-300 text-sm">
                Conectamos clientes a prestadores de serviços de forma prática e confiável.
                Encontre os melhores profissionais da sua região.
              </p>
            </div>

            {/* Links Legais */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações Legais</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowTerms(true)}
                    className="text-gray-300 hover:text-white transition-colors text-sm underline"
                  >
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowPrivacy(true)}
                    className="text-gray-300 hover:text-white transition-colors text-sm underline"
                  >
                    Política de Privacidade
                  </button>
                </li>                
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>suporte@conectaservicos.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Campo Largo - PR, Brasil</span>
                </div>
              </div>
            </div>
          </div>

          {/* Linha divisória e Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {new Date().getFullYear()} ConectaServiços. Todos os direitos reservados.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-400">                               
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Termos de Uso */}
      <Modal 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
        title="Termos de Uso"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <TermsContent />
        </div>
      </Modal>

      {/* Modal Política de Privacidade */}
      <Modal 
        isOpen={showPrivacy} 
        onClose={() => setShowPrivacy(false)} 
        title="Política de Privacidade"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <PrivacyContent />
        </div>
      </Modal>
    </>
  );
};

export default Footer;