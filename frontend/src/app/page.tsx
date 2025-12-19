'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClientOnly } from '../hooks/useClientOnly';
import { useAuth } from '@/contexts/AuthContext';

// Import modern components
import { WarningScreen } from '@/components/sections/WarningScreen';
import { LandingHeader } from '@/components/sections/LandingHeader';
import { HeroSection } from '@/components/sections/HeroSection';
import { RevelationSection } from '@/components/sections/RevelationSection';
import { DemoSection } from '@/components/sections/DemoSection';
import { ProductReveal } from '@/components/sections/ProductReveal';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { StatsSection } from '@/components/sections/StatsSection';

export default function Home() {
  const isClient = useClientOnly();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [showWarning, setShowWarning] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Check if user was redirected from protected route
  useEffect(() => {
    if (!isClient) return;

    const urlParams = new URLSearchParams(window.location.search);
    const openLogin = urlParams.get('openLogin');

    if (openLogin === 'true') {
      router.push('/login');
    }
  }, [isClient, router]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleContinue = () => {
    setShowWarning(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Warning Screen (shows first) */}
      {showWarning && <WarningScreen onContinue={handleContinue} />}

      {/* Main Content (shows after warning) */}
      {showContent && (
        <>
          {/* Header with scroll animations */}
          <LandingHeader />

          {/* Hero Section */}
          <HeroSection />

          {/* Revelation 1 */}
          <RevelationSection
            number="1"
            title="O problema é real"
            description="Profissionais de saúde perdem em média"
            highlight="3 a 4 horas por dia apenas com documentação."
            bgColor="bg-neutral-50"
          />

          {/* Revelation 2 */}
          <RevelationSection
            number="2"
            title="O custo é alto"
            description="Isso representa"
            highlight="40% do tempo de trabalho desperdiçado com tarefas administrativas."
            bgColor="bg-white"
          />

          {/* Revelation 3 */}
          <RevelationSection
            number="3"
            title="A solução existe"
            description="Inteligência artificial especializada que"
            highlight="documenta automaticamente com 99% de precisão."
            bgColor="bg-neutral-50"
          />

          {/* Demo/Comparison Section */}
          <DemoSection />

          {/* Product Reveal */}
          <ProductReveal />

          {/* Features Section */}
          <FeaturesSection />

          {/* Stats Section */}
          <StatsSection />

          {/* Simple Footer */}
          <footer className="bg-neutral-900 text-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                {/* Company */}
                <div>
                  <h3 className="font-bold text-lg mb-4">OrdocAI</h3>
                  <p className="text-neutral-400 text-sm">
                    O futuro da documentação médica com inteligência artificial.
                  </p>
                </div>

                {/* Product */}
                <div>
                  <h4 className="font-semibold mb-4">Produto</h4>
                  <ul className="space-y-2 text-sm text-neutral-400">
                    <li><a href="#features" className="hover:text-white transition-colors">Recursos</a></li>
                    <li><a href="#pricing" className="hover:text-white transition-colors">Preços</a></li>
                    <li><a href="#demo" className="hover:text-white transition-colors">Demonstração</a></li>
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h4 className="font-semibold mb-4">Empresa</h4>
                  <ul className="space-y-2 text-sm text-neutral-400">
                    <li><a href="#about" className="hover:text-white transition-colors">Sobre</a></li>
                    <li><a href="#contact" className="hover:text-white transition-colors">Contato</a></li>
                    <li><a href="#careers" className="hover:text-white transition-colors">Carreiras</a></li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-neutral-400">
                    <li><a href="#privacy" className="hover:text-white transition-colors">Privacidade</a></li>
                    <li><a href="#terms" className="hover:text-white transition-colors">Termos</a></li>
                    <li><a href="#security" className="hover:text-white transition-colors">Segurança</a></li>
                  </ul>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
                <p>© 2025 OrdocAI. Todos os direitos reservados.</p>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    LGPD Compliant
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    ISO 27001
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
