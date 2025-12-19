'use client';

import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient }) => (
  <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100">
    <div className={`w-16 h-16 rounded-xl ${gradient} flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-neutral-900 mb-4">{title}</h3>
    <p className="text-neutral-600 leading-relaxed">{description}</p>
  </div>
);

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '📂',
      title: 'Gestão Documental Inteligente',
      description: 'Organize, versione e busque documentos médicos com OCR automático e indexação avançada.',
      gradient: 'bg-gradient-to-br from-primary-500 to-primary-600'
    },
    {
      icon: '🔄',
      title: 'Workflow Empresarial',
      description: 'Automatize processos médicos com aprovações multi-etapas e notificações inteligentes.',
      gradient: 'bg-gradient-to-br from-medical-500 to-medical-600'
    },
    {
      icon: '✍️',
      title: 'Assinatura Digital Certificada',
      description: 'Assine documentos com certificados A1/A3 e validação ICP-Brasil completa.',
      gradient: 'bg-gradient-to-br from-primary-600 to-medical-500'
    },
    {
      icon: '📊',
      title: 'Relatórios e Analytics',
      description: 'Dashboards executivos com métricas de performance e relatórios customizáveis.',
      gradient: 'bg-gradient-to-br from-medical-600 to-primary-500'
    },
    {
      icon: '🔒',
      title: 'Segurança Total',
      description: 'Criptografia de ponta, auditoria completa e conformidade com LGPD e normas médicas.',
      gradient: 'bg-gradient-to-br from-neutral-600 to-neutral-700'
    },
    {
      icon: '🚀',
      title: 'IA Médica Avançada',
      description: 'Processamento inteligente de conversas médicas com precisão de 99% e aprendizado contínuo.',
      gradient: 'bg-gradient-primary'
    }
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-6">
            Plataforma Completa para{' '}
            <span className="gradient-text">Gestão Médica</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Cinco módulos integrados que transformam a documentação médica em um processo inteligente, seguro e eficiente.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Pronto para revolucionar sua prática médica?
            </h3>
            <p className="text-neutral-600 mb-6">
              Junte-se a milhares de profissionais que já economizam 3+ horas por dia com Ordoc-AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
                Teste Grátis por 30 Dias
              </button>
              <button className="border-2 border-primary-500 text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200">
                Agendar Demonstração
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
