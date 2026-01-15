"use client";

import { Search } from "lucide-react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";

export const EmptySearchResults = ({ onDeepSearch, isExtended }: { onDeepSearch: () => void, isExtended: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="w-64 h-48 mb-6 relative flex items-center justify-center bg-slate-50 rounded-full">
        <Search size={80} className="text-slate-200" />
      </div>

      <h3 className="text-xl text-slate-800 mb-2 font-medium">
        {isExtended ? "Nenhum dos seus arquivos ou pastas corresponde a esta pesquisa" : "Nenhum resultado encontrado"}
      </h3>
      <p className="text-sm text-slate-500 mb-8 max-w-md">
        {isExtended
          ? "Tente outra pesquisa ou use as opções para encontrar um arquivo por tipo, proprietário e muito mais."
          : "Ajuste seus filtros ou pesquise em todo o Drive"}
      </p>

      {!isExtended && (
        <Button
          onClick={onDeepSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 flex items-center gap-2 h-11 font-semibold transition-all shadow-md"
        >
          <Search size={18} />
          Pesquise no Drive
        </Button>
      )}
    </div>
  );
};