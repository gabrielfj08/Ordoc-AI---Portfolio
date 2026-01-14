import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs = () => (
  <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
    <div className="flex items-center gap-1 hover:text-[#f97316] cursor-pointer transition-colors">
      <Home size={16} />
      <span className="font-medium">Meu Drive</span>
    </div>
    <ChevronRight size={14} className="text-slate-300" />
    <span className="text-slate-800 font-bold">Documentos Jurídicos</span>
  </nav>
);