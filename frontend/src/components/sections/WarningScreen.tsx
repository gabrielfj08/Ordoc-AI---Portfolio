'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';

interface WarningScreenProps {
  onContinue: () => void;
}

export const WarningScreen: React.FC<WarningScreenProps> = ({ onContinue }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Warning screen animation
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out"
    })
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.6")
    .to(buttonRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4");
  }, []);

  const handleContinue = () => {
    // Fade out animation
    gsap.to('#warning-screen', {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power2.inOut",
      onComplete: onContinue
    });
  };

  return (
    <div
      id="warning-screen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"
    >
      <div className="max-w-4xl px-8 text-center">
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 opacity-0 translate-y-8"
        >
          Bem-vindo ao <span className="bg-gradient-to-r from-primary-400 to-medical-400 bg-clip-text text-transparent">Futuro</span>
        </h1>

        {/* Warning text */}
        <p
          ref={textRef}
          className="text-xl md:text-2xl text-neutral-300 leading-relaxed mb-12 opacity-0 translate-y-8"
        >
          Esta é uma experiência imersiva que demonstra como a{' '}
          <span className="font-semibold text-white">inteligência artificial</span> pode
          transformar completamente a documentação médica. Prepare-se para ver o impossível
          se tornar realidade.
        </p>

        {/* Continue button */}
        <div ref={buttonRef} className="opacity-0 translate-y-8">
          <Button
            size="lg"
            onClick={handleContinue}
            className="bg-gradient-to-r from-primary-500 to-medical-500 hover:from-primary-600 hover:to-medical-600 text-white px-12 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Continuar →
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-medical-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};
