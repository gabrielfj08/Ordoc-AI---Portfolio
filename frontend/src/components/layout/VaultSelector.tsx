"use client";

import { useState } from "react";
import { ShieldCheck, Globe, Lock, Landmark, ChevronDown, Zap } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { VaultManagementModal } from "./VaultManagementModal";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const VaultSelector = () => {
    const vaults = [
        {
            id: "v-br",
            name: "Cofre Soberano Brasil",
            location: "São Paulo, BR",
            compliance: "LGPD",
            icon: Landmark,
            color: "text-green-600",
            encryption: "AES-256-GCM"
        },
        {
            id: "v-global",
            name: "Global Cloud Vault",
            location: "Virginia, US",
            compliance: "GDPR Ready",
            icon: Globe,
            color: "text-blue-600",
            encryption: "AES-256"
        },
        {
            id: "v-private",
            name: "Private Node (On-Premise)",
            location: "Data Center Adsumtec",
            compliance: "Cofre Blindado",
            icon: Lock,
            color: "text-purple-600",
            encryption: "FIPS 140-2"
        }
    ];

    const [activeVault, setActiveVault] = useState(vaults[0]);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    return (
        <>
            <VaultManagementModal
                isOpen={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
                activeVault={activeVault}
            />

            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 px-4 h-10 bg-orange-500 rounded-full hover:bg-orange-600 transition-all outline-none">
                    <div className="p-1 rounded-lg border-2 border-white bg-transparent">
                        <activeVault.icon size={14} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="text-left hidden lg:block">
                        <p className="text-[10px] font-bold text-orange-100 uppercase tracking-tight leading-none">Cofre Ativo</p>
                        <p className="text-xs font-bold text-white leading-tight">{activeVault.name}</p>
                    </div>
                    <ChevronDown size={14} className="text-white" strokeWidth={2.5} />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-72 p-2 rounded-2xl border-border shadow-2xl" align="end">
                    <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase p-3 tracking-widest">
                        Jurisdições Disponíveis
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {vaults.map((vault) => (
                        <DropdownMenuItem
                            key={vault.id}
                            onClick={() => setActiveVault(vault)}
                            className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-muted transition-colors focus:bg-muted outline-none group"
                        >
                            <div className={`p-2 rounded-xl bg-white border border-border shadow-sm group-hover:scale-110 transition-transform ${vault.color}`}>
                                <vault.icon size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-foreground">{vault.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">{vault.location}</span>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span className="text-xs font-black text-orange-600 uppercase">{vault.compliance}</span>
                                </div>
                            </div>
                            {activeVault.id === vault.id && (
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            )}
                        </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />
                    <div className="p-3 bg-foreground rounded-xl mt-2 mb-2">
                        <div className="flex items-center gap-2 text-white mb-1">
                            <Zap size={12} className="text-orange-500 fill-orange-500" />
                            <span className="text-xs font-bold uppercase tracking-tighter">Status da Criptografia</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono tracking-tighter">
                            {activeVault.encryption} Ativa via Hardware Security Module (HSM).
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full justify-between text-xs font-bold text-muted-foreground hover:bg-muted hover:text-orange-600 h-9"
                        onClick={() => setIsManageModalOpen(true)}
                    >
                        <span>Gerenciar Cofre</span>
                        <Settings2 size={14} />
                    </Button>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};