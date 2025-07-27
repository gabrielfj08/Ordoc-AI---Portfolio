'use client';

import React from 'react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      number: '1.000+',
      label: 'Profissionais de Saúde',
      description: 'Confiam na nossa plataforma'
    },
    {
      number: '99%',
      label: 'Precisão na Documentação',
      description: 'IA treinada especificamente para área médica'
    },
    {
      number: '3h+',
      label: 'Economizadas por Dia',
      description: 'Mais tempo para cuidar dos pacientes'
    },
    {
      number: '100%',
      label: 'Conformidade LGPD',
      description: 'Segurança e privacidade garantidas'
    }
  ];

  return (
    <section className="py-20 bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Números que Comprovam Nossa Excelência
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Resultados reais de profissionais que já transformaram sua prática médica com Ordoc-AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center animate-slide-up bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-white mb-2">
                {stat.label}
              </div>
              <div className="text-white/80 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              "Ordoc-AI revolucionou minha clínica. Agora posso focar 100% nos meus pacientes."
            </h3>
            <p className="text-white/90 mb-4">
              Dr. Maria Silva, Cardiologista - Hospital São Paulo
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
