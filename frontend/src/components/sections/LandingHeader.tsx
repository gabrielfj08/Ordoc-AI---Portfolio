'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, User } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const LandingHeader: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!headerRef.current) return;

    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down - hide header
        gsap.to(headerRef.current, {
          y: -100,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        // Scrolling up - show header
        gsap.to(headerRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      lastScroll = currentScroll;
      setLastScrollY(currentScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add backdrop blur when scrolled
  const headerClasses = lastScrollY > 50
    ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-neutral-200'
    : 'bg-transparent';

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerClasses}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Logo variant="icon" size="sm" />
            <span className="text-xl font-bold text-neutral-900">OrdocAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
            >
              Recursos
            </Link>
            <Link
              href="#how-it-works"
              className="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
            >
              Como Funciona
            </Link>
            <Link
              href="#pricing"
              className="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
            >
              Preços
            </Link>
            <Link
              href="#about"
              className="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
            >
              Sobre
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="group">
                <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Entrar
              </Button>
            </Link>
            <Link href="/login?tab=register">
              <Button className="bg-gradient-to-r from-primary-500 to-medical-500 hover:from-primary-600 hover:to-medical-600 text-white">
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-900" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-neutral-200">
            <Link
              href="#features"
              className="block px-4 py-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Recursos
            </Link>
            <Link
              href="#how-it-works"
              className="block px-4 py-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Como Funciona
            </Link>
            <Link
              href="#pricing"
              className="block px-4 py-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Preços
            </Link>
            <Link
              href="#about"
              className="block px-4 py-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <div className="px-4 pt-4 space-y-2 border-t border-neutral-200">
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
              <Link href="/login?tab=register" className="block">
                <Button className="w-full bg-gradient-to-r from-primary-500 to-medical-500 hover:from-primary-600 hover:to-medical-600 text-white">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
