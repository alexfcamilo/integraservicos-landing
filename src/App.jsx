
import React from 'react';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { ServiceProvider } from './contexts/ServiceContext';
import AppRouter from './components/AppRouter';

function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <AppRouter />
      </ServiceProvider>
    </AuthProvider>
  );
}

export default App;