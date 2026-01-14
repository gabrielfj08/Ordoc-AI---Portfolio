"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
    id: string;
    role: 'ai' | 'user';
    content: string;
    timestamp: Date;
}

export const AIChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: 'Olá! Analisei o contrato e a Cláusula 4.2 parece divergir do padrão da empresa. Gostaria de uma sugestão de redação mais segura?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue("");

        // Mock AI Response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "Entendido. Recomendaria alterar o prazo para 60 dias e incluir a necessidade de notificação por escrito para evitar renovações indesejadas.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
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
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-2 text-xs ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <Avatar className="w-6 h-6 border border-slate-200">
                                {msg.role === 'ai' ? (
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
                                ${msg.role === 'ai'
                                    ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                    : 'bg-indigo-600 text-white rounded-tr-none shadow-md'}
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-200">
                <div className="relative">
                    <Input
                        placeholder="Pergunte sobre o documento..."
                        className="pr-10 h-10 text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                        value={inputValue}
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
