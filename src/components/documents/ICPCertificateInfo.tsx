"use client";

import React from "react";
import { Shield, CheckCircle2, XCircle, Calendar, User, Hash, Award } from "lucide-react";
import { ICPCertificateInfo as ICPCertificateType } from "@/types/document";
import { Badge } from "@/components/ui/badge";

interface ICPCertificateInfoProps {
    certificate: ICPCertificateType;
}

export function ICPCertificateInfo({ certificate }: ICPCertificateInfoProps) {
    const isValid = certificate.isValid && new Date(certificate.validUntil) > new Date();

    return (
        <div className={`rounded-lg border p-4 ${isValid
                ? "border-green-200 bg-green-50/50"
                : "border-red-200 bg-red-50/50"
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Shield size={20} className={isValid ? "text-green-600" : "text-red-600"} />
                    <h4 className="text-sm font-bold text-slate-800">Certificado ICP-Brasil</h4>
                </div>
                <Badge
                    variant={isValid ? "default" : "destructive"}
                    className={`text-[10px] font-bold ${isValid
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                >
                    {isValid ? (
                        <>
                            <CheckCircle2 size={10} className="mr-1" />
                            VÁLIDO
                        </>
                    ) : (
                        <>
                            <XCircle size={10} className="mr-1" />
                            EXPIRADO
                        </>
                    )}
                </Badge>
            </div>

            {/* Certificate Details */}
            <div className="space-y-3">
                <div className="flex items-start gap-2">
                    <Award size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Tipo</p>
                        <p className="text-xs text-slate-700 font-semibold">
                            {certificate.type === 'A1' ? 'A1 (Software)' : 'A3 (Hardware)'}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <User size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Titular</p>
                        <p className="text-xs text-slate-700 font-medium break-all">{certificate.subject}</p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Shield size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Emissor</p>
                        <p className="text-xs text-slate-700 font-medium break-all">{certificate.issuer}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                        <Calendar size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Válido de</p>
                            <p className="text-xs text-slate-700 font-medium">{certificate.validFrom}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Calendar size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Válido até</p>
                            <p className={`text-xs font-medium ${isValid ? "text-slate-700" : "text-red-600"
                                }`}>
                                {certificate.validUntil}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Hash size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Número de Série</p>
                        <p className="text-[10px] text-slate-600 font-mono break-all">{certificate.serialNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
