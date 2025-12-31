/**
 * Biblioteca para acesso a certificados digitais A3 em hardware local
 * Suporta tokens USB e Smart Cards via PKCS#11
 * 
 * IMPORTANTE: Requer componente nativo instalado no cliente
 * Opções: WebExtension (Chrome/Firefox) ou Aplicativo Electron
 */

export interface Certificate {
    id: string;
    subject: string;
    issuer: string;
    serialNumber: string;
    validFrom: Date;
    validUntil: Date;
    thumbprint: string;
    type: 'A1' | 'A3';
}

export interface SignatureResult {
    success: boolean;
    signature?: string;
    error?: string;
}

/**
 * Gerenciador de certificados em hardware local
 */
export class HardwareCertificateManager {
    private nativePort: chrome.runtime.Port | null = null;
    private isElectron: boolean = false;

    constructor() {
        // Detectar ambiente (Browser Extension vs Electron)
        this.isElectron = typeof window !== 'undefined' && (window as any).electron !== undefined;
    }

    /**
     * Inicializa conexão com componente nativo
     */
    async initialize(): Promise<boolean> {
        try {
            if (this.isElectron) {
                // Electron: comunicação via IPC
                return await this.initializeElectron();
            } else {
                // Browser: comunicação via Native Messaging
                return await this.initializeWebExtension();
            }
        } catch (error) {
            console.error('Erro ao inicializar gerenciador de certificados:', error);
            return false;
        }
    }

    /**
     * Inicializa comunicação via Electron IPC
     */
    private async initializeElectron(): Promise<boolean> {
        const { ipcRenderer } = (window as any).electron;
        const response = await ipcRenderer.invoke('certificate:check');
        return response.available;
    }

    /**
     * Inicializa comunicação via WebExtension Native Messaging
     */
    private async initializeWebExtension(): Promise<boolean> {
        return new Promise((resolve) => {
            if (typeof chrome === 'undefined' || !chrome.runtime) {
                resolve(false);
                return;
            }

            this.nativePort = chrome.runtime.connectNative('com.ordoc.certificate_manager');

            this.nativePort.onMessage.addListener((message) => {
                if (message.type === 'initialized') {
                    resolve(true);
                }
            });

            this.nativePort.onDisconnect.addListener(() => {
                console.error('Componente nativo desconectado');
                resolve(false);
            });

            // Timeout de 5 segundos
            setTimeout(() => resolve(false), 5000);
        });
    }

    /**
     * Lista certificados disponíveis em tokens/smart cards
     */
    async listCertificates(): Promise<Certificate[]> {
        try {
            if (this.isElectron) {
                const { ipcRenderer } = (window as any).electron;
                const response = await ipcRenderer.invoke('certificate:list');
                return this.parseCertificates(response.certificates);
            } else if (this.nativePort) {
                return await this.sendNativeMessage({ action: 'list_certificates' });
            }

            throw new Error('Gerenciador não inicializado');
        } catch (error) {
            console.error('Erro ao listar certificados:', error);
            return [];
        }
    }

    /**
     * Assina hash usando certificado do token
     */
    async signHash(
        hash: string,
        certificateId: string,
        pin?: string
    ): Promise<SignatureResult> {
        try {
            const payload = {
                action: 'sign_hash',
                hash,
                certificateId,
                pin
            };

            if (this.isElectron) {
                const { ipcRenderer } = (window as any).electron;
                const response = await ipcRenderer.invoke('certificate:sign', payload);
                return {
                    success: response.success,
                    signature: response.signature,
                    error: response.error
                };
            } else if (this.nativePort) {
                const response = await this.sendNativeMessage(payload);
                return {
                    success: response.success,
                    signature: response.signature,
                    error: response.error
                };
            }

            return {
                success: false,
                error: 'Gerenciador não inicializado'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            };
        }
    }

    /**
     * Envia mensagem para componente nativo (WebExtension)
     */
    private sendNativeMessage(message: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.nativePort) {
                reject(new Error('Porta nativa não conectada'));
                return;
            }

            const messageId = Math.random().toString(36).substring(7);
            const messageWithId = { ...message, id: messageId };

            const listener = (response: any) => {
                if (response.id === messageId) {
                    this.nativePort?.onMessage.removeListener(listener);
                    resolve(response);
                }
            };

            this.nativePort.onMessage.addListener(listener);
            this.nativePort.postMessage(messageWithId);

            setTimeout(() => {
                this.nativePort?.onMessage.removeListener(listener);
                reject(new Error('Timeout ao aguardar resposta'));
            }, 30000);
        });
    }

    /**
     * Converte resposta do componente nativo para formato Certificate
     */
    private parseCertificates(rawCertificates: any[]): Certificate[] {
        return rawCertificates.map(cert => ({
            id: cert.id || cert.thumbprint,
            subject: cert.subject,
            issuer: cert.issuer,
            serialNumber: cert.serialNumber,
            validFrom: new Date(cert.validFrom),
            validUntil: new Date(cert.validUntil),
            thumbprint: cert.thumbprint,
            type: cert.type || 'A3'
        }));
    }

    /**
     * Desconecta do componente nativo
     */
    disconnect(): void {
        if (this.nativePort) {
            this.nativePort.disconnect();
            this.nativePort = null;
        }
    }
}
