'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const ProductReveal: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Set initial states
    gsap.set(logoRef.current, { scale: 0, rotation: -180, opacity: 0 });
    gsap.set(nameRef.current, { y: 50, opacity: 0 });
    gsap.set(taglineRef.current, { y: 30, opacity: 0 });
    gsap.set(ctaRef.current, { scale: 0.8, opacity: 0 });

    // Create timeline with scroll trigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      }
    });

    tl.to(logoRef.current, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 1.2,
      ease: "back.out(1.7)"
    })
    .to(nameRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6")
    .to(taglineRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4")
    .to(ctaRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.2");

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-neutral-900 to-medical-900 px-4 py-20 relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-medical-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Logo */}
        <div ref={logoRef} className="mb-8 flex justify-center">
          <div className="relative">
            <Logo variant="full" size="xl" className="drop-shadow-2xl" />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-medical-500 blur-3xl opacity-50"></div>
          </div>
        </div>

        {/* Product Name */}
        <h2
          ref={nameRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
        >
          Ordoc<span className="bg-gradient-to-r from-primary-400 to-medical-400 bg-clip-text text-transparent">AI</span>
        </h2>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-2xl md:text-3xl text-neutral-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          O futuro da documentação médica chegou.{' '}
          <span className="text-white font-semibold">
            Inteligência artificial especializada
          </span>{' '}
          que transforma conversas em documentos perfeitos.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login?tab=register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-medical-500 hover:from-primary-600 hover:to-medical-600 text-white px-12 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-105 group"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Começar Agora Grátis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="#demo">
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-12 py-6 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Ver Demonstração
            </Button>
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-neutral-400">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-medical-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-primary-600 border-2 border-white"></div>
            </div>
            <span className="text-sm">+1.000 profissionais de saúde confiam</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              LGPD Compliant
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              ISO 27001
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              CFM Approved
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
