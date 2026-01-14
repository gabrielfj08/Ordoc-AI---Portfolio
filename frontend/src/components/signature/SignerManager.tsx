"use client";

import { Plus, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignatureStore } from "@/store/signatureStore";
import { Signer } from "@/types/signature";

const COLORS = [
    "#ea580c", // Orange (Brand)
    "#2563eb", // Blue
    "#16a34a", // Green
    "#9333ea", // Purple
    "#dc2626", // Red
    "#db2777", // Pink
];

export const SignerManager = () => {
    const { signers, addSigner, removeSigner } = useSignatureStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const handleAdd = () => {
        if (!newName || !newEmail) return;

        const color = COLORS[signers.length % COLORS.length];

        const newSigner: Signer = {
            id: crypto.randomUUID(),
            name: newName,
            email: newEmail,
            color
        };

        addSigner(newSigner);
        setNewName("");
        setNewEmail("");
        setIsAdding(false);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Signatários</h3>

            <div className="space-y-2">
                {signers.map((signer) => (
                    <div key={signer.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50 relative group">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: signer.color }}
                            >
                                {signer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-700">{signer.name}</p>
                                <p className="text-[10px] text-slate-400">{signer.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeSigner(signer.id)}
                        >
                            <Trash2 size={12} />
                        </Button>
                    </div>
                ))}
            </div>

            {isAdding ? (
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2 animate-in slide-in-from-top-2">
                    <Input
                        placeholder="Nome"
                        className="h-8 text-xs bg-white"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                    />
                    <Input
                        placeholder="Email"
                        className="h-8 text-xs bg-white"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <div className="flex gap-2 pt-1">
                        <Button size="sm" className="h-7 text-xs flex-1 bg-slate-800 hover:bg-slate-900 text-white" onClick={handleAdd}>Confirmar</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs flex-1" onClick={() => setIsAdding(false)}>Cancelar</Button>
                    </div>
                </div>
            ) : (
                <Button
                    variant="outline"
                    className="w-full text-xs gap-2 border-dashed text-slate-500 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50"
                    onClick={() => setIsAdding(true)}
                >
                    <UserPlus size={14} />
                    Adicionar Signatário
                </Button>
            )}
        </div>
    );
};
