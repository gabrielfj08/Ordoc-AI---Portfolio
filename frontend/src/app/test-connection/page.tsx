'use client';

import { useState } from 'react';
import { authService } from '@/services/auth';
import { documentService } from '@/services/documents';

export default function TestConnectionPage() {
    const [status, setStatus] = useState<string>('Aguardando teste...');
    const [details, setDetails] = useState<any>(null);

    const testBackendConnection = async () => {
        try {
            setStatus('🔄 Testando conexão com backend...');

            // Teste 1: Health check
            const healthResponse = await fetch('http://localhost:8000/health/');
            const healthData = await healthResponse.json();

            setStatus(`✅ Backend está rodando! Status: ${healthData.status}`);
            setDetails({ health: healthData });

        } catch (error: any) {
            setStatus(`❌ Erro ao conectar: ${error.message}`);
            setDetails({ error: error.toString() });
        }
    };

    const testAuth = async () => {
        try {
            setStatus('🔄 Testando autenticação...');

            // Tentar login com credenciais de teste
            const result = await authService.login({
                email: 'admin@example.com',
                password: 'admin123',
            });

            setStatus(`✅ Login bem-sucedido! Usuário: ${result.user.email}`);
            setDetails({ auth: result });

        } catch (error: any) {
            setStatus(`❌ Erro no login: ${error.response?.data?.detail || error.message}`);
            setDetails({ error: error.response?.data || error.toString() });
        }
    };

    const testDocuments = async () => {
        try {
            setStatus('🔄 Testando listagem de documentos...');

            const docs = await documentService.list({ page: 1, page_size: 10 });

            setStatus(`✅ Documentos carregados! Total: ${docs.count}`);
            setDetails({ documents: docs });

        } catch (error: any) {
            setStatus(`❌ Erro ao listar documentos: ${error.response?.data?.detail || error.message}`);
            setDetails({ error: error.response?.data || error.toString() });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🧪 Teste de Conexão Frontend ↔ Backend</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Status da Conexão</h2>
                    <p className="text-lg mb-4">{status}</p>

                    <div className="flex gap-4">
                        <button
                            onClick={testBackendConnection}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Testar Backend
                        </button>

                        <button
                            onClick={testAuth}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Testar Autenticação
                        </button>

                        <button
                            onClick={testDocuments}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Testar Documentos
                        </button>
                    </div>
                </div>

                {details && (
                    <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm overflow-auto">
                        <h3 className="text-white font-bold mb-2">Detalhes da Resposta:</h3>
                        <pre>{JSON.stringify(details, null, 2)}</pre>
                    </div>
                )}

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informações</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• API Base URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}</li>
                        <li>• WebSocket URL: {process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}</li>
                        <li>• Environment: {process.env.NEXT_PUBLIC_ENVIRONMENT || 'development'}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
