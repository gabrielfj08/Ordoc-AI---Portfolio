'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-medical-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-medical-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <Logo variant="full" size="xl" className="mx-auto" />
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 animate-slide-up">
            Transforme conversas médicas em{' '}
            <span className="gradient-text">documentação perfeita</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Devolva aos profissionais de saúde o tempo necessário para cuidar do que realmente importa: seus pacientes.
          </p>

          {/* Key benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-primary-100">
              <span className="text-primary-600 font-semibold">✨ 99% de Precisão</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-medical-100">
              <span className="text-medical-600 font-semibold">⚡ 3h+ Economizadas/Dia</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-primary-100">
              <span className="text-primary-600 font-semibold">🔒 100% Seguro</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" className="min-w-[200px]">
              Começar Gratuitamente
            </Button>
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Ver Demonstração
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <p className="text-neutral-500 text-sm mb-6">Confiado por mais de 1.000 profissionais de saúde</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-neutral-400">CRM</div>
              <div className="text-2xl font-bold text-neutral-400">CFM</div>
              <div className="text-2xl font-bold text-neutral-400">ANVISA</div>
              <div className="text-2xl font-bold text-neutral-400">LGPD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-neutral-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-neutral-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};
