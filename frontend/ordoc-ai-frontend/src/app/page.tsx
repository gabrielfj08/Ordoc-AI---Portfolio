'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useClientOnly } from '../hooks/useClientOnly';
import { useAuth } from '@/contexts/AuthContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const isClient = useClientOnly();
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  

  
  // Check if user was redirected from protected route and redirect to login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const openLogin = urlParams.get('openLogin');
    
    if (openLogin === 'true') {
      // Redirect to login page instead of opening modal
      router.push('/login');
    }
  }, [router]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Só executar no cliente
    if (!isClient) return;
    // Custom Cursor
    const cursor = document.getElementById('cursor');
    
    const handleMouseMove = (e: MouseEvent) => {
      if (cursor) {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('button, a, .before-side, .after-side');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor?.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor?.classList.remove('active');
      });
    });

    // Warning Screen Animation
    const initWarning = () => {
      const tl = gsap.timeline();
      
      tl.to('.warning-title', {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      })
      .to('.warning-text', {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=0.6")
      .to('.warning-continue', {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4");
    };

    // Continue Button
    const continueBtn = document.getElementById('continueBtn');
    continueBtn?.addEventListener('click', () => {
      gsap.to('#warning', {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          const warningEl = document.getElementById('warning');
          if (warningEl) {
            warningEl.style.display = 'none';
            initMainContent();
          }
        }
      });
    });

    // Login Button Handler - Redirect to /login page
    const loginBtn = document.getElementById('loginBtn');
    loginBtn?.addEventListener('click', () => {
      router.push('/login');
    });



    // Main Content Animations
    const initMainContent = () => {
      gsap.to('#mainContent', {
        opacity: 1,
        duration: 0.5
      });

      // Hero animations
      const heroTl = gsap.timeline();
      
      heroTl.to('.hero-label', {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      })
      .to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.6")
      .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .to('.hero-question', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6");

      // Revelation sections
      gsap.utils.toArray('.revelation').forEach((section: any, i) => {
        const content = section.querySelector('.revelation-content');
        const number = content?.querySelector('.revelation-number');
        const title = content?.querySelector('.revelation-title');
        const text = content?.querySelector('.revelation-text');
        const emphasis = content?.querySelector('.revelation-emphasis');

        gsap.fromTo([number, title, text, emphasis], {
          opacity: 0,
          y: 40
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // Demo section
      gsap.fromTo('.demo-title', {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.demo-section',
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });

      gsap.fromTo('.before-side', {
        opacity: 0,
        x: -50
      }, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.comparison',
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });

      gsap.fromTo('.after-side', {
        opacity: 0,
        x: 50
      }, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.comparison',
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });

      gsap.fromTo('.transform-trigger', {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.transform-trigger',
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Product reveal
      gsap.fromTo('.product-logo', {
        opacity: 0,
        scale: 0
      }, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: '.product-reveal',
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });

      gsap.fromTo(['.product-name', '.product-tagline', '.product-cta'], {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.product-reveal',
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });

      // Features animation
      gsap.fromTo('.features-title', {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.features-section',
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });

      gsap.utils.toArray('.feature-card').forEach((card: any, i) => {
        gsap.fromTo(card, {
          opacity: 0,
          y: 40
        }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
      });
    };

    // Transform button effect
    const transformBtn = document.getElementById('transformBtn');
    transformBtn?.addEventListener('click', () => {
      // Fade out before side
      gsap.to('.before-side', {
        opacity: 0.3,
        scale: 0.98,
        duration: 1.5,
        ease: "power2.out"
      });

      // Highlight after side
      gsap.to('.after-side', {
        borderColor: '#1a1a1a',
        borderWidth: '2px',
        scale: 1.02,
        duration: 1.5,
        ease: "power2.out"
      });

      // Button feedback
      gsap.to('.transform-trigger', {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });

      // Create subtle animation on after side items
      gsap.fromTo('.after-side .side-items li', {
        x: 0
      }, {
        x: 5,
        duration: 0.3,
        stagger: 0.05,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    });

    // Header show/hide on scroll
    let lastScrollY = 0;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        gsap.to('.header', { y: -100, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to('.header', { y: 0, duration: 0.3, ease: "power2.out" });
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);

    // Initialize warning screen
    initWarning();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', requestTick);
    };
  }, [isClient]);

  return (
    <>
      {/* Custom Cursor */}
      <div className="cursor" id="cursor"></div>

      {/* Warning Screen */}
      <div className="warning-screen" id="warning">
        <h1 className="warning-title">Aviso</h1>
        <p className="warning-text">
          Esta experiência questionará sua percepção atual sobre gestão documental. 
          Prepare-se para ver a realidade sob uma nova perspectiva.
        </p>
        <button className="warning-continue" id="continueBtn">Continuar</button>
      </div>



      {/* Main Content */}
      <div className="main-content" id="mainContent">
        {/* Header */}
        <header className="header">
          <nav className="nav">
            <a href="#" className="logo">
              <div className="logo-icon">O</div>
              <div className="logo-text">Ordoc-AI</div>
            </a>
            <ul className="nav-links">
              <li><a href="#revelacao" className="nav-link">Revelação</a></li>
              <li><a href="#comparacao" className="nav-link">Comparação</a></li>
              <li><a href="#produto" className="nav-link">Produto</a></li>
              <li><a href="#contato" className="nav-link">Contato</a></li>
              <li><a href="#demo" className="nav-cta">Experimentar</a></li>
              <li><button className="user-icon-btn" id="loginBtn">
                <svg className="user-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button></li>
            </ul>
          </nav>
        </header>

        {/* Hero */}
        <section className="hero">
          <div className="hero-label">O futuro da documentação</div>
          <h1 className="hero-title">Sua empresa está<br />perdendo tempo?</h1>
          <p className="hero-subtitle">
            Enquanto você gerencia documentos manualmente, 
            outras organizações já operaram 10 anos no futuro.
          </p>
          <div className="hero-question">A pergunta é: você está preparado para descobrir o que perdeu?</div>
        </section>

        {/* Revelation 1 */}
        <section className="revelation" id="revelacao">
          <div className="revelation-content">
            <div className="revelation-number">01 — Primeira revelação</div>
            <h2 className="revelation-title">Documentos não são<br />apenas arquivos</h2>
            <p className="revelation-text">
              Eles são o DNA da sua organização. Cada documento perdido, cada processo manual, 
              cada minuto desperdiçado na busca de informações representa oportunidades que nunca voltarão.
            </p>
            <div className="revelation-emphasis">
              "O tempo que você perde hoje é o crescimento que não terá amanhã."
            </div>
          </div>
        </section>

        {/* Revelation 2 */}
        <section className="revelation">
          <div className="revelation-content">
            <div className="revelation-number">02 — Segunda revelação</div>
            <h2 className="revelation-title">Inteligência Artificial<br />não é futuro</h2>
            <p className="revelation-text">
              É presente. Organizações que não integraram IA em seus processos documentais 
              já estão operando com desvantagem competitiva irreversível.
            </p>
            <div className="revelation-emphasis">
              "A transformação digital não é uma escolha. É uma questão de sobrevivência."
            </div>
          </div>
        </section>

        {/* Revelation 3 */}
        <section className="revelation">
          <div className="revelation-content">
            <div className="revelation-number">03 — Terceira revelação</div>
            <h2 className="revelation-title">Você tem duas opções</h2>
            <p className="revelation-text">
              Continuar operando com sistemas fragmentados, processos manuais e ineficiências 
              que drenam recursos. Ou fazer a transição para um futuro onde cada documento 
              trabalha para você.
            </p>
            <div className="revelation-emphasis">
              "A decisão que você tomar hoje definirá onde sua empresa estará em 5 anos."
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="demo-section" id="comparacao">
          <div className="demo-container">
            <h2 className="demo-title">Sua realidade atual vs. Futuro possível</h2>
            <div className="comparison">
              <div className="before-side">
                <h3 className="side-title">Como opera hoje</h3>
                <ul className="side-items">
                  <li>Documentos dispersos em múltiplos sistemas</li>
                  <li>Busca manual que consome horas</li>
                  <li>Processos de aprovação lentos</li>
                  <li>Retrabalho constante</li>
                  <li>Falta de visibilidade sobre status</li>
                  <li>Erros humanos frequentes</li>
                  <li>Dependência de pessoas específicas</li>
                  <li>Compliance manual e arriscado</li>
                </ul>
              </div>
              <div className="after-side">
                <h3 className="side-title">Como poderia operar</h3>
                <ul className="side-items">
                  <li>Ecossistema integrado e inteligente</li>
                  <li>Busca semântica instantânea</li>
                  <li>Workflows automáticos</li>
                  <li>Processos otimizados por IA</li>
                  <li>Transparência total em tempo real</li>
                  <li>Precisão de 99.9%</li>
                  <li>Autonomia operacional completa</li>
                  <li>Compliance automático e auditável</li>
                </ul>
              </div>
            </div>
            <button className="transform-trigger" id="transformBtn">Iniciar transformação</button>
          </div>
        </section>

        {/* Product Reveal */}
        <section className="product-reveal" id="produto">
          <div className="product-logo">O</div>
          <h1 className="product-name">Ordoc-AI</h1>
          <p className="product-tagline">Ordem inteligente na gestão documental</p>
          <a href="#demo" className="product-cta">Experimentar agora</a>
        </section>

        {/* Features */}
        <section className="features-section">
          <div className="features-container">
            <h2 className="features-title">Como funciona a transformação</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-number">01</div>
                <h3 className="feature-title">Captura Inteligente</h3>
                <p className="feature-desc">IA identifica, categoriza e indexa automaticamente qualquer documento que entra no sistema.</p>
              </div>
              <div className="feature-card">
                <div className="feature-number">02</div>
                <h3 className="feature-title">Processamento Automático</h3>
                <p className="feature-desc">Workflows inteligentes roteiam documentos, executam aprovações e garantem compliance sem intervenção manual.</p>
              </div>
              <div className="feature-card">
                <div className="feature-number">03</div>
                <h3 className="feature-title">Insights Preditivos</h3>
                <p className="feature-desc">Analytics avançadas antecipam gargalos, sugerem otimizações e fornecem visibilidade estratégica.</p>
              </div>
              <div className="feature-card">
                <div className="feature-number">04</div>
                <h3 className="feature-title">Evolução Contínua</h3>
                <p className="feature-desc">Sistema aprende com cada interação, refinando processos e aumentando eficiência automaticamente.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Produto</h4>
              <a href="#">Funcionalidades</a>
              <a href="#">Integração</a>
              <a href="#">Segurança</a>
              <a href="#">API</a>
            </div>
            <div className="footer-section">
              <h4>Soluções</h4>
              <a href="#">Empresas</a>
              <a href="#">Setor Público</a>
              <a href="#">Escritórios</a>
              <a href="#">Saúde</a>
            </div>
            <div className="footer-section">
              <h4>Recursos</h4>
              <a href="#">Documentação</a>
              <a href="#">Suporte</a>
              <a href="#">Cases</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-section">
              <h4>Empresa</h4>
              <a href="#">Sobre</a>
              <a href="#">Carreiras</a>
              <a href="#">Contato</a>
              <a href="#">Imprensa</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Ordoc-AI. Ordem inteligente na gestão documental.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
