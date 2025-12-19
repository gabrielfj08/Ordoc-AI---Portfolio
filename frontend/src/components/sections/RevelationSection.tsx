'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevelationSectionProps {
  number: string;
  title: string;
  description: string;
  highlight?: string;
  bgColor?: string;
  textColor?: string;
}

export const RevelationSection: React.FC<RevelationSectionProps> = ({
  number,
  title,
  description,
  highlight,
  bgColor = 'bg-white',
  textColor = 'text-neutral-900'
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !numberRef.current || !contentRef.current) return;

    // Set initial state
    gsap.set(numberRef.current, { opacity: 0, scale: 0.5 });
    gsap.set(contentRef.current, { opacity: 0, y: 50 });

    // Create scroll trigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      }
    });

    tl.to(numberRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4");

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
      className={`min-h-screen flex items-center justify-center ${bgColor} px-4 py-20`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Number */}
        <div ref={numberRef} className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold text-white">{number}</span>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="text-center">
          <h2 className={`text-4xl md:text-6xl lg:text-7xl font-bold ${textColor} mb-8 leading-tight`}>
            {title}
          </h2>

          <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed max-w-4xl mx-auto">
            {description}
            {highlight && (
              <>
                {' '}
                <span className="font-bold bg-gradient-to-r from-primary-600 to-medical-600 bg-clip-text text-transparent">
                  {highlight}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-12 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-primary-500 to-medical-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};
