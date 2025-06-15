
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Header />
        <Dashboard />
      </div>
    </ThemeProvider>
  );
};

export default Index;
