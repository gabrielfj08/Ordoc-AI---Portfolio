import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

/**
 * Hook para gerenciar notificações Push do navegador
 * 
 * Usa a Web Push API para enviar notificações nativas mesmo com app fechado
 * Requer permissão do usuário e HTTPS (ou localhost para desenvolvimento)
 */

export interface PushNotificationOptions {
    /** Solicitar permissão automaticamente ao montar */
    autoRequest?: boolean
    /** Callback quando receber notificação */
    onNotification?: (notification: NotificationEvent) => void
}

export function usePushNotifications(options: PushNotificationOptions = {}) {
    const { autoRequest = false, onNotification } = options
    
    const [permission, setPermission] = useState<NotificationPermission>('default')
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    // Verificar suporte
    useEffect(() => {
        const supported =
            'Notification' in window &&
            'serviceWorker' in navigator &&
            'PushManager' in window

        setIsSupported(supported)

        if (supported) {
            setPermission(Notification.permission)
        }
    }, [])

    // Solicitar permissão automaticamente
    useEffect(() => {
        if (autoRequest && isSupported && permission === 'default') {
            requestPermission()
        }
    }, [autoRequest, isSupported, permission])

    /**
     * Solicita permissão do usuário para notificações
     */
    const requestPermission = useCallback(async () => {
        if (!isSupported) {
            toast({
                variant: 'destructive',
                title: 'Notificações não suportadas',
                description: 'Seu navegador não suporta notificações push',
            })
            return false
        }

        if (permission === 'granted') {
            return true
        }

        try {
            setLoading(true)
            const result = await Notification.requestPermission()
            setPermission(result)

            if (result === 'granted') {
                toast({
                    title: '🔔 Notificações ativadas',
                    description: 'Você receberá alertas mesmo com o app fechado',
                })
                
                // Registrar service worker e subscription
                await registerServiceWorker()
                return true
            } else if (result === 'denied') {
                toast({
                    variant: 'destructive',
                    title: 'Permissão negada',
                    description: 'Você bloqueou as notificações. Ative nas configurações do navegador.',
                })
                return false
            }

            return false
        } catch (error) {
            console.error('Erro ao solicitar permissão:', error)
            toast({
                variant: 'destructive',
                description: 'Erro ao solicitar permissão para notificações',
            })
            return false
        } finally {
            setLoading(false)
        }
    }, [isSupported, permission, toast])

    /**
     * Registra o service worker e cria subscription
     */
    const registerServiceWorker = useCallback(async () => {
        if (!('serviceWorker' in navigator)) return

        try {
            // Registrar service worker
            let registration = await navigator.serviceWorker.getRegistration()
            
            if (!registration) {
                registration = await navigator.serviceWorker.register('/sw.js')
                console.log('Service Worker registrado:', registration)
            }

            // Verificar se já existe subscription
            let pushSubscription = await registration.pushManager.getSubscription()

            if (!pushSubscription) {
                // Criar nova subscription
                // Nota: Em produção, você precisaria de uma chave VAPID pública
                // const applicationServerKey = urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
                
                pushSubscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    // applicationServerKey, // Descomentar em produção
                })

                console.log('Push subscription criada:', pushSubscription)

                // Aqui você enviaria a subscription para o backend
                // await sendSubscriptionToBackend(pushSubscription)
            }

            setSubscription(pushSubscription)
        } catch (error) {
            console.error('Erro ao registrar service worker:', error)
        }
    }, [])

    /**
     * Remove subscription de push
     */
    const unsubscribe = useCallback(async () => {
        if (!subscription) return

        try {
            setLoading(true)
            await subscription.unsubscribe()
            setSubscription(null)
            
            // Aqui você notificaria o backend para remover a subscription
            // await removeSubscriptionFromBackend(subscription)

            toast({
                description: 'Notificações push desativadas',
            })
        } catch (error) {
            console.error('Erro ao cancelar subscription:', error)
            toast({
                variant: 'destructive',
                description: 'Erro ao desativar notificações',
            })
        } finally {
            setLoading(false)
        }
    }, [subscription, toast])

    /**
     * Envia notificação de teste
     */
    const sendTestNotification = useCallback(() => {
        if (permission !== 'granted') {
            toast({
                variant: 'destructive',
                description: 'Permissão de notificação não concedida',
            })
            return
        }

        const notification = new Notification('Ordoc-AI - Notificação de Teste', {
            body: 'Esta é uma notificação de teste do sistema Ordoc-AI',
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: 'test-notification',
            requireInteraction: false,
            timestamp: Date.now(),
            data: {
                url: window.location.origin,
                type: 'test',
            },
        })

        notification.onclick = () => {
            window.focus()
            notification.close()
        }

        toast({
            description: 'Notificação de teste enviada!',
        })
    }, [permission, toast])

    /**
     * Mostra notificação personalizada
     */
    const showNotification = useCallback(
        (title: string, options?: NotificationOptions) => {
            if (permission !== 'granted') {
                console.warn('Permissão de notificação não concedida')
                return null
            }

            const notification = new Notification(title, {
                icon: '/icon-192x192.png',
                badge: '/badge-72x72.png',
                ...options,
            })

            notification.onclick = () => {
                window.focus()
                notification.close()
                onNotification?.(notification as any)
            }

            return notification
        },
        [permission, onNotification]
    )

    return {
        // Estado
        isSupported,
        permission,
        isGranted: permission === 'granted',
        isDenied: permission === 'denied',
        subscription,
        loading,

        // Ações
        requestPermission,
        unsubscribe,
        sendTestNotification,
        showNotification,
    }
}

// Utilidades
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}
