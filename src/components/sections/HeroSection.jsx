import React from 'react';

const HeroSection = ({ onNavigate }) => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Encontre as melhores empresas<br />
              separadas por categoria
            </h1>
          </div>
        </div>
        
        {/* Curved bottom */}
        <div className="relative">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L1440 120L1440 0C1440 0 1140 60 720 60C300 60 0 0 0 0V120Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>
    </>
  );
};

export default HeroSection;