"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { intelligenceService, ChatMessage } from "@/services/intelligence";
import { toast } from "sonner";

interface AIChatProps {
    documentId: string;
}

export const AIChat = ({ documentId }: AIChatProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Inicializar conversa vinculada ao documento
    useEffect(() => {
        const initChat = async () => {
            try {
                // Tenta encontrar uma conversa existente ou cria uma nova
                const response = await intelligenceService.createConversation({
                    document_id: documentId,
                    title: `Conversa sobre ${documentId}`
                });
                setConversationId(response.id);

                // Carregar mensagens se houver
                const msgRes = await intelligenceService.getMessages(response.id);
                setMessages(msgRes.messages);
            } catch (error) {
                console.error("Erro ao iniciar chat:", error);
                toast.error("Não foi possível iniciar o chat inteligente.");
            }
        };

        if (documentId) {
            initChat();
        }
    }, [documentId]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !conversationId || isLoading) return;

        const content = inputValue;
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await intelligenceService.sendMessage(conversationId, {
                content: content
            });

            // Adiciona mensagens (usuário e assistente) à lista
            setMessages(prev => [...prev, response.user_message, response.assistant_message]);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            toast.error("Erro ao processar sua pergunta.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-slate-200 bg-white flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Bot size={14} className="text-indigo-600" />
                </div>
                <span className="text-xs font-bold text-slate-700">Ordoc AI Assistant</span>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center py-8">
                            <Bot className="mx-auto text-slate-300 mb-2" size={32} />
                            <p className="text-[10px] text-slate-400 font-medium">
                                Nenhuma mensagem ainda. <br /> Comece perguntando algo sobre o documento.
                            </p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-2 text-xs ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <Avatar className="w-6 h-6 border border-slate-200">
                                {msg.role !== 'user' ? (
                                    <>
                                        <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
                                            <Bot size={12} className="text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <AvatarFallback className="bg-slate-200 text-slate-600">
                                        <User size={12} />
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <div className={`
                                p-3 rounded-xl max-w-[85%] leading-relaxed 
                                ${msg.role !== 'user'
                                    ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                    : 'bg-indigo-600 text-white rounded-tr-none shadow-md'}
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-2 text-xs">
                            <Avatar className="w-6 h-6 border border-slate-200">
                                <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
                                    <Bot size={12} className="text-white animate-pulse" />
                                </div>
                            </Avatar>
                            <div className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl rounded-tl-none shadow-sm italic flex items-center gap-2">
                                <span className="flex gap-1">
                                    <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" />
                                    <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </span>
                                Analisando contexto...
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-200">
                <div className="relative">
                    <Input
                        placeholder={isLoading ? "IA está pensando..." : "Pergunte sobre o documento..."}
                        className="pr-10 h-10 text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                        value={inputValue}
                        disabled={isLoading}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                        onClick={handleSendMessage}
                    >
                        <Send size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
