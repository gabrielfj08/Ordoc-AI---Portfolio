"use client";

import React, { useState } from "react";
import { Palette, Upload, Type, FileText, Download, Image as ImageIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CorporateStyle {
    logo: string | null;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    documentHeader: string;
    documentFooter: string;
    watermark: string;
    pdfLayout: 'standard' | 'compact' | 'detailed';
}

interface StyleGuideConfigProps {
    onSave?: (style: CorporateStyle) => void;
    onClose?: () => void;
}

export function StyleGuideConfig({ onSave, onClose }: StyleGuideConfigProps) {
    const [style, setStyle] = useState<CorporateStyle>({
        logo: null,
        primaryColor: '#f97316',
        secondaryColor: '#3b82f6',
        fontFamily: 'Inter',
        documentHeader: 'Cofre Soberano Brasil',
        documentFooter: '© 2026 Ordoc - Todos os direitos reservados',
        watermark: 'CONFIDENCIAL',
        pdfLayout: 'standard'
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
                setStyle({ ...style, logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave?.(style);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Palette size={24} className="text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Guia de Estilo Corporativo</h3>
                        <p className="text-sm text-slate-500">Configure a identidade visual dos seus documentos</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Seção 1: Configuração de Marca */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <ImageIcon size={20} className="text-purple-600" />
                        <h4 className="font-bold text-slate-800">Configuração de Marca</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Logo Upload */}
                        <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Logo Corporativo</Label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-purple-300 transition-colors">
                                {logoPreview ? (
                                    <div className="space-y-3">
                                        <img src={logoPreview} alt="Logo" className="max-h-24 mx-auto" />
                                        <Button size="sm" variant="outline" onClick={() => {
                                            setLogoPreview(null);
                                            setStyle({ ...style, logo: null });
                                        }}>
                                            Remover Logo
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <label htmlFor="logo-upload" className="cursor-pointer">
                                            <Upload size={32} className="mx-auto text-slate-300 mb-2" />
                                            <p className="text-sm font-medium text-slate-600">Clique para fazer upload</p>
                                            <p className="text-xs text-slate-400 mt-1">PNG, JPG ou SVG (max. 2MB)</p>
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Cores */}
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-semibold text-slate-700 mb-2 block">Cor Primária</Label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={style.primaryColor}
                                        onChange={(e) => setStyle({ ...style, primaryColor: e.target.value })}
                                        className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
                                    />
                                    <Input
                                        value={style.primaryColor}
                                        onChange={(e) => setStyle({ ...style, primaryColor: e.target.value })}
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-semibold text-slate-700 mb-2 block">Cor Secundária</Label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={style.secondaryColor}
                                        onChange={(e) => setStyle({ ...style, secondaryColor: e.target.value })}
                                        className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
                                    />
                                    <Input
                                        value={style.secondaryColor}
                                        onChange={(e) => setStyle({ ...style, secondaryColor: e.target.value })}
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-semibold text-slate-700 mb-2 block">Fonte</Label>
                                <select
                                    value={style.fontFamily}
                                    onChange={(e) => setStyle({ ...style, fontFamily: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                >
                                    <option value="Inter">Inter</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Open Sans">Open Sans</option>
                                    <option value="Lato">Lato</option>
                                    <option value="Montserrat">Montserrat</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Seção 2: Templates de Documentos */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <FileText size={20} className="text-blue-600" />
                        <h4 className="font-bold text-slate-800">Templates de Documentos</h4>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Cabeçalho Padrão</Label>
                            <Input
                                value={style.documentHeader}
                                onChange={(e) => setStyle({ ...style, documentHeader: e.target.value })}
                                placeholder="Ex: Nome da Empresa"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Rodapé Padrão</Label>
                            <Input
                                value={style.documentFooter}
                                onChange={(e) => setStyle({ ...style, documentFooter: e.target.value })}
                                placeholder="Ex: © 2026 Sua Empresa - Todos os direitos reservados"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Seção 3: Configurações de Exportação */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Download size={20} className="text-green-600" />
                        <h4 className="font-bold text-slate-800">Configurações de Exportação</h4>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Marca d'Água</Label>
                            <Input
                                value={style.watermark}
                                onChange={(e) => setStyle({ ...style, watermark: e.target.value })}
                                placeholder="Ex: CONFIDENCIAL, RASCUNHO"
                            />
                            <p className="text-xs text-slate-500 mt-1">Deixe em branco para não exibir marca d'água</p>
                        </div>

                        <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Layout de PDF</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['standard', 'compact', 'detailed'] as const).map(layout => (
                                    <button
                                        key={layout}
                                        onClick={() => setStyle({ ...style, pdfLayout: layout })}
                                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${style.pdfLayout === layout
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                            }`}
                                    >
                                        {layout === 'standard' && 'Padrão'}
                                        {layout === 'compact' && 'Compacto'}
                                        {layout === 'detailed' && 'Detalhado'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Settings size={18} className="text-slate-600" />
                        Preview do Estilo
                    </h4>
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                            {logoPreview && <img src={logoPreview} alt="Logo" className="h-8" />}
                            <p className="text-sm font-medium" style={{ color: style.primaryColor }}>
                                {style.documentHeader}
                            </p>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="h-3 bg-slate-100 rounded w-full"></div>
                            <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                            <div className="h-3 bg-slate-100 rounded w-4/6"></div>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-500 text-center">{style.documentFooter}</p>
                        </div>
                        {style.watermark && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-4xl font-bold text-slate-200 opacity-20 rotate-[-45deg]">
                                    {style.watermark}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Salvar Configurações
                </Button>
            </div>
        </div>
    );
}
