// src/components/layout/MainContainer.tsx
import React from "react";

export const MainContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      {/* Container fluido que alinha com a Topbar */}
      <div className="w-full px-6 md:px-10 lg:px-14 py-8">
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
};