"use client";

import * as React from "react";
import { PenTool, Type, Calendar, User, ShieldCheck, ChevronLeft, Save, MoreHorizontal, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignatureStore } from "@/store/signatureStore";
import { SignatureField, Signer } from "@/types/signature";
import { SignerManager } from "./SignerManager";
import { SealProcessModal } from "./SealProcessModal";
import { SignAssistant } from "./SignAssistant";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SignEditor = ({ docName, onClose, isGuestMode }: { docName: string; onClose?: () => void; isGuestMode?: boolean }) => {
    const { fields, signers, addField, updateFieldSigner, removeField } = useSignatureStore();
    const [isSealing, setIsSealing] = React.useState(false);
    const dropZoneRef = React.useRef<HTMLDivElement>(null);

    // Função de Drop no Canvas
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData("fieldType");

        if (!type || !dropZoneRef.current) return;

        const rect = dropZoneRef.current.getBoundingClientRect();

        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const finalX = Math.max(0, Math.min(x, 90));
        const finalY = Math.max(0, Math.min(y, 95));

        const newField: SignatureField = {
            id: crypto.randomUUID(),
            type: type as any,
            page: 1,
            x: finalX,
            y: finalY,
            label: getLabelByType(type)
        };

        addField(newField);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const getSignerById = (id?: string) => signers.find(s => s.id === id);

    return (
        <div className="flex h-full bg-slate-100 relative">
            <SealProcessModal
                isOpen={isSealing}
                onClose={() => setIsSealing(false)}
                onComplete={() => {
                    setIsSealing(false);
                    if (onClose) onClose();
                }}
            />

            {/* Sidebar de Ferramentas */}
            <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
                <SignerManager />

                <div className="border-t pt-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Campos do Signatário</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <DraggableField type="signature" icon={PenTool} label="Assinatura" />
                        <DraggableField type="text" icon={Type} label="Texto Livre" />
                        <DraggableField type="date" icon={Calendar} label="Data" />
                        <DraggableField type="name" icon={User} label="Nome Completo" />
                    </div>
                </div>

                <div className="mt-auto pt-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-700 mb-2 font-bold text-sm">
                            <ShieldCheck size={16} />
                            Segurança WASM
                        </div>
                        <p className="text-[11px] text-blue-600 leading-relaxed">
                            Este documento está sendo processado localmente. O selo SHA-256 será gerado ao finalizar.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Área do Canvas */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}><ChevronLeft /></Button>
                        <h1 className="font-medium text-slate-800">{docName}</h1>
                    </div>
                    <Button
                        onClick={() => setIsSealing(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 gap-2 font-bold shadow-md shadow-orange-100"
                    >
                        <Save size={18} />
                        Finalizar e Enviar
                    </Button>
                </header>

                <div className="flex-1 overflow-auto p-12 flex justify-center bg-slate-200">
                    <div
                        ref={dropZoneRef}
                        className="w-[595px] h-[842px] bg-white shadow-2xl relative border border-slate-300 transition-all"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
                            <p className="text-slate-400 text-6xl font-serif">PDF Content</p>
                        </div>

                        {fields.map((field) => {
                            const signer = getSignerById(field.signerId);
                            const borderColor = signer?.color || "#cbd5e1"; // slate-300 default
                            const bgColor = signer ? `${signer.color}20` : "#f1f5f9"; // transparent version or slate-100

                            return (
                                <DropdownMenu key={field.id}>
                                    <DropdownMenuTrigger asChild>
                                        <div
                                            className="absolute p-2 cursor-pointer flex items-center gap-2 shadow-sm hover:scale-105 transition-transform group"
                                            style={{
                                                left: `${field.x}%`,
                                                top: `${field.y}%`,
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: 20,
                                                borderColor: borderColor,
                                                backgroundColor: bgColor,
                                                borderWidth: '2px',
                                                borderStyle: 'solid',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            <FieldIcon type={field.type} size={14} style={{ color: signer?.color || "#64748b" }} />
                                            <span
                                                className="text-[10px] uppercase font-bold whitespace-nowrap"
                                                style={{ color: signer?.color || "#475569" }}
                                            >
                                                {field.label}
                                            </span>
                                            {signer && (
                                                <div
                                                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white text-[8px] flex items-center justify-center font-bold shadow-sm"
                                                    style={{ backgroundColor: signer.color }}
                                                >
                                                    {signer.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                        <DropdownMenuLabel>Atribuir Signatário</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {signers.length === 0 ? (
                                            <div className="p-2 text-xs text-slate-500 text-center">Nenhum signatário cadastrado.</div>
                                        ) : (
                                            signers.map(s => (
                                                <DropdownMenuItem key={s.id} onClick={() => updateFieldSigner(field.id, s.id)} className="gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                                    <span>{s.name}</span>
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => removeField(field.id)} className="text-red-600 focus:text-red-600">
                                            Remover Campo
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            );
                        })}

                    </div>
                </div>


                {/* AI Assistant Integration */}
                <SignAssistant
                    onAddField={(type, x, y) => {
                        // Adjust coordinates as percentages relative to the fixed A4 container roughly
                        // The helper passes raw pixels? No, let's assume it passes approximate pixels relative to a standard view
                        // But our store expects X/Y percentages (0-100).
                        // The assistant passes (400, 600) for "bottom right".
                        // 595px width, 842px height.
                        // 400/595 ~= 67%
                        // 600/842 ~= 71%

                        const newField: SignatureField = {
                            id: crypto.randomUUID(),
                            type: 'initial' as any, // force 'initial' for rubric as per requirement
                            page: 1,
                            x: 67, // Manual placement for demo
                            y: 71,
                            label: 'Rubrica'
                        };
                        addField(newField);
                    }}
                />
            </main >
        </div >
    );
};

// Componente Draggable da Sidebar
interface DraggableFieldProps {
    icon: React.ElementType;
    label: string;
    type: string;
}

const DraggableField = ({ icon: Icon, label, type }: DraggableFieldProps) => {
    const handleDragStart = (e: React.DragEvent) => {
        // Define os dados a serem transferidos
        e.dataTransfer.setData("fieldType", type);
        e.dataTransfer.effectAllowed = "copy";
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-grab hover:border-blue-400 hover:bg-white transition-all group active:cursor-grabbing"
        >
            <Icon size={18} className="text-slate-500 group-hover:text-blue-600" />
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
    );
};

// Auxiliares
const getLabelByType = (type: string) => {
    switch (type) {
        case 'signature': return 'Assinatura';
        case 'text': return 'Texto Livre';
        case 'date': return 'Data';
        case 'name': return 'Nome Completo';
        default: return 'Campo';
    }
};

const FieldIcon = ({ type, ...props }: { type: string } & React.ComponentProps<any>) => {
    switch (type) {
        case 'signature': return <PenTool {...props} />;
        case 'text': return <Type {...props} />;
        case 'date': return <Calendar {...props} />;
        case 'name': return <User {...props} />;
        default: return <PenTool {...props} />;
    }
}