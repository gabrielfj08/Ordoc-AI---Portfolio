"use client";

import { useState } from "react";
import * as React from "react";
import {
  ShieldCheck, AlertTriangle, XCircle, Zap,
  RefreshCcw, FileSignature, ShieldAlert, History, X,
  Folder, FileText, User, Calendar, Shield, HardDrive, LucideIcon, Sparkles, Clock, Tag, Edit3,
  Brain, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentItem } from "./DocumentList";
import { VersionHistoryModal } from "./VersionHistoryModal";
import { MetadataEditor } from "./MetadataEditor";
import { ICPCertificateInfo } from "./ICPCertificateInfo";
import { DocumentAnalysisView } from "@/components/intelligence/DocumentAnalysisView";
import {
  useDocumentAnalysisComplete,
  useAnalyzeDocument,
} from "@/hooks/queries/useIntelligence";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentDetailsProps {
  item: DocumentItem | null;
  onClose?: () => void;
  onGenerateSummary?: () => void;
}

export const DocumentDetails = ({ item, onClose, onGenerateSummary }: DocumentDetailsProps) => {
  const [activeTab, setActiveTab] = useState<"detalhes" | "atividades" | "analise-ia">("detalhes");
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showMetadataEditor, setShowMetadataEditor] = useState(false);

  // Hooks de IA (apenas para files, não folders)
  const isFile = item?.type === 'file';
  const documentId = item?.id;

  const {
    analysis,
    alerts,
    isLoading: isLoadingAnalysis,
    isError: isAnalysisError,
  } = useDocumentAnalysisComplete(isFile && documentId ? documentId : '');

  const { mutate: reanalyze, isPending: isReanalyzing } = useAnalyzeDocument();

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 bg-white border-l border-slate-100">
      {/* Cabeçalho com Abas (Sempre Visível) */}
      <div className="flex items-center justify-between px-4 pt-4 border-b border-slate-100">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("detalhes")}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "detalhes" ? "border-[#f97316] text-[#f97316]" : "border-transparent text-slate-500"}`}
          >
            Detalhes
          </button>
          <button
            onClick={() => setActiveTab("atividades")}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "atividades" ? "border-[#f97316] text-[#f97316]" : "border-transparent text-slate-500"}`}
          >
            Atividades
          </button>
          {isFile && (
            <button
              onClick={() => setActiveTab("analise-ia")}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === "analise-ia" ? "border-purple-600 text-purple-600" : "border-transparent text-slate-500"}`}
            >
              <Brain size={16} />
              Análise de IA
              {alerts && alerts.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  {alerts.length}
                </Badge>
              )}
            </button>
          )}
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 mb-2 text-slate-500 hover:bg-slate-50">
            <X size={18} />
          </Button>
        )}
      </div>

      <div className="p-6 overflow-y-auto flex-1 bg-white">
        {!item ? (
          /* Estado Vazio */
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center bg-white">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 border-slate-100">
              <HardDrive size={32} className="text-slate-300" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">Nenhum item selecionado</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-200px">
              Selecione um arquivo ou pasta para ver seus detalhes e atividades.
            </p>
            {onClose && (
              <Button variant="ghost" className="mt-8 text-slate-400 hover:text-slate-600" onClick={onClose}>
                Fechar
              </Button>
            )}
          </div>
        ) : activeTab === "detalhes" ? (
          /* Conteúdo da Aba Detalhes */
          <div className="space-y-6">
            <div className={`h-32 rounded-xl flex items-center justify-center border transition-colors ${item.health === 'critical' ? 'bg-red-50/50 border-red-100' :
              item.health === 'warning' ? 'bg-orange-50/50 border-orange-100' :
                'bg-slate-50 border-slate-200'
              }`}>
              {item.type === 'folder' ? (
                <Folder size={48} className={item.health === 'critical' ? 'text-red-300 fill-red-50' : item.health === 'warning' ? 'text-orange-300 fill-orange-50' : "text-blue-300 fill-blue-50"} />
              ) : (
                <FileText size={48} className={item.health === 'critical' ? 'text-red-300' : item.health === 'warning' ? 'text-orange-300' : "text-slate-300"} />
              )}
            </div>

            <div className="text-center mb-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                {item.health && getHealthIcon(item.health)}
                <h3 className="font-semibold text-slate-800 break-all">{item.name}</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium uppercase mt-1">
                {item.type === 'folder' ? 'Pasta' : item.size} • {item.health ? <span className={`uppercase font-bold ${getHealthTextColor(item.health)}`}>{item.health}</span> : 'Verificado'}
              </p>
            </div>

            {(item.health === 'warning' || item.health === 'critical') && (
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                  <Zap size={40} className="text-white" />
                </div>

                <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-orange-100">
                  <Zap size={16} className="fill-orange-100" /> IA Ordoc Sugere:
                </h3>

                <p className="text-[11px] text-orange-50 leading-relaxed mb-4">
                  {getHealthActionMessage(item.health)}
                </p>

                <Button className="w-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs h-9 rounded-xl gap-2 border-none backdrop-blur-sm transition-all">
                  {item.health === 'critical' ? <RefreshCcw size={14} /> : <FileSignature size={14} />}
                  {item.health === 'critical' ? 'Reparar Integridade' : 'Renovar Assinaturas'}
                </Button>
              </div>
            )}

            {/* Tags Section */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-orange-50 text-[#f97316] border-orange-200 text-[10px] font-semibold"
                  >
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <DetailItem icon={User} label="Proprietário" value={item.owner} />
              <DetailItem icon={Calendar} label="Modificado" value={item.date} />
              <DetailItem icon={Shield} label="Acesso" value="Restrito (Padrão)" />
              <DetailItem icon={FingerprintIcon} label="SHA-256" value={item.id.substring(0, 12) + "..."} />
              {item.version && (
                <DetailItem icon={Clock} label="Versão" value={`v${item.version}`} />
              )}
              {item.category && (
                <DetailItem icon={Tag} label="Categoria" value={item.category} />
              )}
            </div>

            {/* ICP Certificate Section */}
            {item.icpCertificate && (
              <div className="pt-4">
                <ICPCertificateInfo certificate={item.icpCertificate} />
              </div>
            )}

            {/* Metadata Section */}
            {item.metadata && Object.keys(item.metadata).length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Metadados Customizados</h4>
                <div className="space-y-2">
                  {Object.entries(item.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase min-w-[80px]">{key}:</span>
                      <span className="text-xs text-slate-700 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botão Editar Metadados */}
            <div className="pt-2">
              <Button
                onClick={() => setShowMetadataEditor(true)}
                variant="outline"
                className="w-full h-10 gap-2 text-slate-600 hover:text-[#f97316] hover:border-orange-200 hover:bg-orange-50 transition-all group"
              >
                <Edit3 size={16} className="text-slate-400 group-hover:text-[#f97316] transition-colors" />
                <span className="text-xs font-semibold">Editar Metadados e Tags</span>
              </Button>
            </div>

            {/* Botão Ver Versões */}
            {item.type === 'file' && item.versionHistory && item.versionHistory.length > 0 && (
              <div className="pt-2">
                <Button
                  onClick={() => setShowVersionHistory(true)}
                  variant="outline"
                  className="w-full h-10 gap-2 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                >
                  <Clock size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-xs font-semibold">Ver Histórico de Versões</span>
                </Button>
              </div>
            )}

            {/* Ação de Resumo IA */}
            {onGenerateSummary && (
              <div className="pt-2">
                <Button onClick={onGenerateSummary} variant="outline" className="w-full h-10 gap-2 text-slate-600 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all group">
                  <Sparkles size={16} className="text-slate-400 group-hover:text-purple-500 transition-colors" />
                  <span className="text-xs font-semibold">Gerar Resumo Inteligente</span>
                </Button>
              </div>
            )}
          </div>
        ) : activeTab === "atividades" ? (
          /* Conteúdo da Aba Atividades */
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registos de Atividade</h4>
            <div className="space-y-3">
              <ActivityItem icon={History} label="Criado por" value="Ricardo Silva" date="08 Jan" />
              <ActivityItem icon={ShieldCheck} label="Última Validação" value="Sucesso" date="Hoje, 10:25" />
              {item.health !== 'healthy' && (
                <ActivityItem icon={AlertTriangle} label="Alerta de Compliance" value={item.health === 'warning' ? 'Vencimento Próximo' : 'Integridade Comprometida'} date="Agora" />
              )}
            </div>
          </div>
        ) : activeTab === "analise-ia" ? (
          /* Conteúdo da Aba Análise de IA */
          <div className="space-y-6">
            {/* Header com botão de re-análise */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Análise de Inteligência Artificial
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Deliberação do Conselho de IA multi-modelo
                </p>
              </div>
              <Button
                onClick={() => {
                  if (documentId) {
                    reanalyze({
                      document_id: documentId,
                      document_content: '',
                      analysis_depth: 'full',
                    });
                  }
                }}
                disabled={isReanalyzing}
                size="sm"
                variant="outline"
                className="gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                {isReanalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4" />
                    Re-analisar
                  </>
                )}
              </Button>
            </div>

            {/* Loading State */}
            {isLoadingAnalysis && (
              <Card>
                <CardContent className="py-8 text-center">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 text-purple-600 animate-spin" />
                  <p className="text-sm font-medium text-slate-700">Carregando análise...</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Consultando o Conselho de IA
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {isAnalysisError && !isLoadingAnalysis && (
              <Card>
                <CardContent className="py-8 text-center">
                  <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                  <p className="text-sm font-medium text-slate-700">Erro ao carregar análise</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Não foi possível carregar a análise deste documento
                  </p>
                  <Button
                    onClick={() => {
                      if (documentId) {
                        reanalyze({
                          document_id: documentId,
                          document_content: '',
                          analysis_depth: 'full',
                        });
                      }
                    }}
                    className="mt-4"
                    variant="outline"
                    size="sm"
                  >
                    Tentar novamente
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Empty State - Documento não analisado ainda */}
            {!isLoadingAnalysis && !isAnalysisError && !analysis && (
              <Card>
                <CardContent className="py-8 text-center">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-purple-300" />
                  <p className="text-sm font-medium text-slate-700">Documento ainda não analisado</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Clique em "Re-analisar" para iniciar uma análise completa
                  </p>
                  <Button
                    onClick={() => {
                      if (documentId) {
                        reanalyze({
                          document_id: documentId,
                          document_content: '',
                          analysis_depth: 'full',
                        });
                      }
                    }}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Analisar documento
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Análise Completa */}
            {analysis && !isLoadingAnalysis && (
              <DocumentAnalysisView analysis={analysis} />
            )}

            {/* Alertas Específicos */}
            {alerts && alerts.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Alertas Identificados
                  </CardTitle>
                  <CardDescription>
                    A IA identificou {alerts.length} alerta{alerts.length > 1 ? 's' : ''} neste documento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 bg-white rounded-lg border border-amber-200"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                        <Badge
                          variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'high' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">{alert.message}</p>
                      {alert.suggested_actions && alert.suggested_actions.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-amber-100">
                          <p className="text-xs font-medium text-amber-700 mb-1">Ações sugeridas:</p>
                          <ul className="space-y-1">
                            {alert.suggested_actions.map((action, idx) => (
                              <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                <span className="text-amber-600">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </div>

      {/* Version History Modal */}
      {item && showVersionHistory && (
        <VersionHistoryModal
          documentName={item.name}
          currentVersion={item.version || 1}
          versions={item.versionHistory || []}
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          onRestore={(version) => {
            console.log('Restaurar versão:', version);
            setShowVersionHistory(false);
          }}
          onDownload={(version) => {
            console.log('Baixar versão:', version);
          }}
          onPreview={(version) => {
            console.log('Visualizar versão:', version);
          }}
        />
      )}

      {/* Metadata Editor Modal */}
      {item && showMetadataEditor && (
        <MetadataEditor
          tags={item.tags}
          metadata={item.metadata}
          isOpen={showMetadataEditor}
          onClose={() => setShowMetadataEditor(false)}
          onSave={(tags, metadata) => {
            console.log('Salvar metadados:', { tags, metadata });
            setShowMetadataEditor(false);
          }}
        />
      )}
    </div>
  );
};

// Componentes Auxiliares
interface DetailItemProps {
  icon: LucideIcon | React.ElementType;
  label: string;
  value: string;
}

const DetailItem = ({ icon: Icon, label, value }: DetailItemProps) => (
  <div className="flex items-center gap-3">
    <Icon size={16} className="text-slate-400" />
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
      <p className="text-xs text-slate-700 font-medium">{value}</p>
    </div>
  </div>
);

interface ActivityItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  date: string;
}

const ActivityItem = ({ icon: Icon, label, value, date }: ActivityItemProps) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-medium">{label}</p>
        <p className="text-[11px] font-bold text-slate-700">{value}</p>
      </div>
    </div>
    <span className="text-[10px] text-slate-400">{date}</span>
  </div>
);

const FingerprintIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-3" /><path d="M2 12c0-5.5 4.5-10 10-10s10 4.5 10 10" /><path d="M7 12c0-2.8 2.2-5 5-5s5 2.2 5 5" /><path d="M12 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Z" /><path d="M12 17c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Z" /><path d="M15 22v-2c0-1.7-1.3-3-3-3s-3 1.3-3 3v2" /></svg>
);

// Lógica de Cores e Mensagens
const getHealthTextColor = (health?: string) => {
  switch (health) {
    case 'healthy': return 'text-green-600';
    case 'warning': return 'text-orange-600';
    case 'critical': return 'text-red-600';
    default: return 'text-slate-400';
  }
};

const getHealthIcon = (health?: string) => {
  switch (health) {
    case 'healthy': return <ShieldCheck size={16} className="text-green-500" />;
    case 'warning': return <AlertTriangle size={16} className="text-orange-500" />;
    case 'critical': return <XCircle size={16} className="text-red-500" />;
    default: return null;
  }
};

const getHealthActionMessage = (health?: string) => {
  if (health === 'critical') return "Detetada quebra na integridade SHA-256. Este documento pode ter sido alterado fora do Ordoc. Recomenda-se a reparação via backup seguro.";
  if (health === 'warning') return "Este contrato expira em breve ou possui assinaturas pendentes. Ative o fluxo de renovação automática para evitar quebras de compliance.";
  return "";
};