'use client';

import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onComplete, 
  duration = 4000 
}) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // Loading messages
  const messages = [
    'Preparando seu ambiente de trabalho...',
    'Inicializando OrdocAir...',
    'Carregando OrdocFlow...',
    'Preparando OrdocSign...',
    'Configurando OrdocReports...',
    'Carregando dashboard...'
  ];

  // Module icons
  const modules = [
    { name: 'Documentos', icon: '📄', color: 'text-blue-500' },
    { name: 'Workflows', icon: '⚡', color: 'text-green-500' },
    { name: 'Assinaturas', icon: '✍️', color: 'text-purple-500' },
    { name: 'Relatórios', icon: '📊', color: 'text-orange-500' }
  ];

  useEffect(() => {
    const startTime = Date.now();
    const messageInterval = duration / messages.length;
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      const newMessageIndex = Math.min(Math.floor(elapsed / messageInterval), messages.length - 1);
      
      setProgress(newProgress);
      setMessageIndex(newMessageIndex);
      
      if (elapsed >= duration) {
        clearInterval(timer);
        if (onComplete) {
          setTimeout(onComplete, 200);
        }
      }
    }, 50);

    return () => clearInterval(timer);
  }, [duration, onComplete, messages.length]);

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">O</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Ordoc-AI
          </h1>
          <p className="text-gray-600 text-sm">
            Ordem Inteligente no Cuidado
          </p>
        </div>

        {/* Welcome message */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Bem-vindo, Usuário Ordoc AI!
          </h2>
          <p 
            key={messageIndex}
            className="text-gray-600 animate-fade-in"
          >
            {messages[messageIndex]}
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-green-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Carregando dashboard...
          </p>
        </div>

        {/* Module icons */}
        <div className="flex justify-center space-x-8">
          {modules.map((module, index) => (
            <div key={index} className="text-center">
              <div 
                className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl mb-2 transition-all duration-500 ${
                  progress > (index + 1) * 25 ? 'bg-white shadow-md scale-110' : ''
                }`}
              >
                <span className={module.color}>{module.icon}</span>
              </div>
              <p className="text-xs text-gray-500">{module.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
export { LoadingScreen };
