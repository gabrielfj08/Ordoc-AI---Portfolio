'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, FileText, Zap } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const DemoSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const [isTransformed, setIsTransformed] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !beforeRef.current || !afterRef.current) return;

    // Initial state
    gsap.set(beforeRef.current, { x: 0, opacity: 1 });
    gsap.set(afterRef.current, { x: 0, opacity: 0 });

    // Scroll trigger for initial reveal
    gsap.from(sectionRef.current.querySelector('h2'), {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 30,
      duration: 0.8
    });
  }, []);

  const handleTransform = () => {
    if (isTransformed) {
      // Reset to before
      gsap.to(beforeRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.inOut"
      });
      gsap.to(afterRef.current, {
        x: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut"
      });
    } else {
      // Transform to after
      gsap.to(beforeRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut"
      });
      gsap.to(afterRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.inOut"
      });
    }
    setIsTransformed(!isTransformed);
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 py-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-neutral-900 mb-16">
          Veja a <span className="bg-gradient-to-r from-primary-600 to-medical-600 bg-clip-text text-transparent">Transformação</span>
        </h2>

        {/* Comparison Container */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[500px]">
            {/* Before Side */}
            <div
              ref={beforeRef}
              className="absolute inset-0 md:relative p-8 md:p-12 bg-gradient-to-br from-neutral-100 to-neutral-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">Antes</h3>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold text-xl">✗</span>
                    <span className="text-neutral-700">3-4 horas por dia em documentação manual</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold text-xl">✗</span>
                    <span className="text-neutral-700">Erros de digitação e inconsistências</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold text-xl">✗</span>
                    <span className="text-neutral-700">Menos tempo com os pacientes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold text-xl">✗</span>
                    <span className="text-neutral-700">Burnout e sobrecarga administrativa</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold text-xl">✗</span>
                    <span className="text-neutral-700">Documentos incompletos ou atrasados</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  💸 Perda estimada: R$ 15.000/mês em produtividade
                </p>
              </div>
            </div>

            {/* After Side */}
            <div
              ref={afterRef}
              className="absolute inset-0 md:relative p-8 md:p-12 bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col justify-between opacity-0"
            >
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">Depois</h3>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span className="text-neutral-700">Documentação automática em segundos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span className="text-neutral-700">99% de precisão com IA especializada</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span className="text-neutral-700">3+ horas por dia economizadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span className="text-neutral-700">Mais tempo de qualidade com pacientes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span className="text-neutral-700">Satisfação profissional restaurada</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  💰 Ganho estimado: R$ 25.000/mês em produtividade
                </p>
              </div>
            </div>
          </div>

          {/* Transform Button (Centered) */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <Button
              size="lg"
              onClick={handleTransform}
              className="bg-gradient-to-r from-primary-500 to-medical-500 hover:from-primary-600 hover:to-medical-600 text-white shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-105"
            >
              {isTransformed ? (
                <>
                  <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                  Ver Antes
                </>
              ) : (
                <>
                  Ver Depois
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
