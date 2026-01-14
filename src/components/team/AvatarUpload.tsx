"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AvatarUploadProps {
    currentAvatar?: string;
    userId: string;
    userName: string;
    onUploadComplete?: (avatarUrl: string) => void;
}

export const AvatarUpload = ({
    currentAvatar,
    userId,
    userName,
    onUploadComplete,
}: AvatarUploadProps) => {
    const [preview, setPreview] = useState<string | null>(currentAvatar || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validações
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("Arquivo muito grande", {
                description: "O tamanho máximo é 5MB",
            });
            return;
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Formato inválido", {
                description: "Use apenas JPG, PNG ou WebP",
            });
            return;
        }

        // Preview local
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload para o servidor
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await fetch(`/api/v1/ordoc-cloud/users/${userId}/upload_avatar/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro ao fazer upload");
            }

            const data = await response.json();
            const avatarUrl = data.avatar_url || data.avatar;

            toast.success("Avatar atualizado com sucesso!");
            if (onUploadComplete) {
                onUploadComplete(avatarUrl);
            }
        } catch (error: any) {
            console.error("Erro ao fazer upload:", error);
            toast.error("Erro ao fazer upload do avatar", {
                description: error.message || "Tente novamente",
            });
            // Reverter preview em caso de erro
            setPreview(currentAvatar || null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!confirm("Deseja remover o avatar?")) return;

        setIsUploading(true);
        try {
            const response = await fetch(
                `/api/v1/ordoc-cloud/users/${userId}/remove_avatar/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao remover avatar");
            }

            setPreview(null);
            toast.success("Avatar removido com sucesso!");
            if (onUploadComplete) {
                onUploadComplete("");
            }
        } catch (error: any) {
            console.error("Erro ao remover avatar:", error);
            toast.error("Erro ao remover avatar", {
                description: error.message || "Tente novamente",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const getInitials = () => {
        const names = userName.split(" ");
        if (names.length >= 2) {
            return names[0].charAt(0) + names[names.length - 1].charAt(0);
        }
        return userName.charAt(0);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar Display */}
            <div className="relative group">
                {preview ? (
                    <img
                        src={preview}
                        alt={userName}
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-border"
                    />
                ) : (
                    <div className="w-32 h-32 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-4xl border-4 border-border">
                        {getInitials()}
                    </div>
                )}

                {/* Overlay em hover */}
                <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={32} />
                </div>

                {/* Loading overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
                        <Loader2 className="text-white animate-spin" size={32} />
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
                <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-orange-600 hover:bg-orange-700"
                >
                    <Upload size={14} className="mr-2" />
                    {preview ? "Trocar" : "Upload"}
                </Button>

                {preview && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRemoveAvatar}
                        disabled={isUploading}
                        className="text-red-600 hover:text-red-700"
                    >
                        <X size={14} className="mr-2" />
                        Remover
                    </Button>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Info */}
            <p className="text-xs text-muted-foreground text-center max-w-xs">
                JPG, PNG ou WebP. Máximo 5MB.
                <br />
                Recomendado: 400x400px
            </p>
        </div>
    );
};
