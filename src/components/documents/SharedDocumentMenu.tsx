"use client";

import React, { useState } from "react";
import {
  X, UserPlus, Globe, Link2, Check,
  ChevronDown, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SharedDocumentMenuProps {
  itemName: string;
  itemType: "file" | "folder";
  isOpen: boolean;
  onClose: () => void;
}

type AccessRole = "viewer" | "editor" | "admin";
type GeneralAccess = "restricted" | "anyone";

interface AccessUser {
  id: string;
  name: string;
  email: string;
  role: AccessRole;
  avatarUrl?: string; // Opcional
}

// Mock inicial de usuários
const initialUsers: AccessUser[] = [
  {
    id: "me",
    name: "Ricardo (Você)",
    email: "ricardo@adsumtec.com",
    role: "admin",
  },
  {
    id: "u2",
    name: "Pedro Henrique",
    email: "pedro@adsumtec.com",
    role: "editor",
  }
];

export function SharedDocumentMenu({ itemName, isOpen, onClose }: SharedDocumentMenuProps) {
  const [users, setUsers] = useState<AccessUser[]>(initialUsers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AccessRole>("editor");
  const [generalAccess, setGeneralAccess] = useState<GeneralAccess>("restricted");
  const [linkCopied, setLinkCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    // Simulação de cópia
    navigator.clipboard.writeText(`https://ordoc.ai/s/${Math.random().toString(36).substring(7)}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleInvite = () => {
    if (!inviteEmail) return;

    // Mock de adicionar usuário
    const newUser: AccessUser = {
      id: Math.random().toString(36),
      name: inviteEmail.split("@")[0], // Nome provisório
      email: inviteEmail,
      role: inviteRole
    };

    setUsers([...users, newUser]);
    setInviteEmail("");
  };

  const getRoleLabel = (role: AccessRole) => {
    switch (role) {
      case "viewer": return "Leitor";
      case "editor": return "Editor";
      case "admin": return "Administrador";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <UserPlus size={20} className="text-[#f97316]" />
            Compartilhar &quot;{itemName}&quot;
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Input de Convite */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Adicionar pessoas, grupos ou e-mails"
                  className="pr-20"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                />
                <div className="absolute right-1 top-1 bottom-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-full px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded flex items-center gap-1 transition-colors">
                        {getRoleLabel(inviteRole)} <ChevronDown size={12} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setInviteRole("viewer")}>Leitor</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setInviteRole("editor")}>Editor</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setInviteRole("admin")}>Administrador</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Button
                disabled={!inviteEmail}
                onClick={handleInvite}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white"
              >
                Enviar
              </Button>
            </div>
          </div>

          {/* Lista de Pessoas */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pessoas com acesso</h3>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-slate-200">
                      {user.avatarUrl ? (
                        <AvatarImage src={user.avatarUrl} />
                      ) : (
                        <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        {user.name}
                        {user.id === 'me' && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-normal">você</span>}
                      </span>
                      <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-sm text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-50 flex items-center gap-1 transition-colors">
                          {getRoleLabel(user.role)} <ChevronDown size={14} className="text-slate-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setUsers(users.map(u => u.id === user.id ? { ...u, role: 'viewer' } : u))
                        }}>Leitor</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setUsers(users.map(u => u.id === user.id ? { ...u, role: 'editor' } : u))
                        }}>Editor</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setUsers(users.map(u => u.id === user.id ? { ...u, role: 'admin' } : u))
                        }}>Administrador</DropdownMenuItem>
                        {user.id !== 'me' && (
                          <>
                            <div className="h-px bg-slate-100 my-1" />
                            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => {
                              setUsers(users.filter(u => u.id !== user.id))
                            }}>
                              Remover acesso
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acesso Geral */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acesso geral</h3>

            <div className="flex items-center gap-3">
              <div className={`
                 h-10 w-10 rounded-full flex items-center justify-center shrink-0
                 ${generalAccess === 'restricted' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-600'}
               `}>
                {generalAccess === 'restricted' ? <Shield size={20} /> : <Globe size={20} />}
              </div>

              <div className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-sm font-medium text-slate-700 flex items-center gap-1 hover:text-blue-600 transition-colors">
                      {generalAccess === 'restricted' ? 'Restrito' : 'Qualquer pessoa com o link'}
                      <ChevronDown size={14} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem onClick={() => setGeneralAccess("restricted")} className="gap-2">
                      <Shield size={16} className="text-slate-500" />
                      <div className="flex flex-col">
                        <span>Restrito</span>
                        <span className="text-xs text-slate-400">Somente pessoas adicionadas podem abrir</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setGeneralAccess("anyone")} className="gap-2">
                      <Globe size={16} className="text-green-500" />
                      <div className="flex flex-col">
                        <span>Qualquer pessoa com o link</span>
                        <span className="text-xs text-slate-400">Qualquer pessoa na internet pode ver</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className="text-xs text-slate-500 mt-0.5">
                  {generalAccess === 'restricted'
                    ? 'Somente pessoas com acesso podem abrir com este link.'
                    : 'Qualquer pessoa na internet com este link pode ver.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <Button
            variant="outline"
            className={`gap-2 ${linkCopied ? 'border-green-500 text-green-600 bg-green-50' : 'text-blue-600 border-blue-200 hover:bg-blue-50'}`}
            onClick={handleCopyLink}
          >
            {linkCopied ? <Check size={16} /> : <Link2 size={16} />}
            {linkCopied ? 'Link copiado!' : 'Copiar link'}
          </Button>

          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white min-w-24">
            Concluído
          </Button>
        </div>
      </div>
    </div>
  );
}