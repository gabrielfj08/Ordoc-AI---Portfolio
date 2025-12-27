export class NotificationSound {
    private audio: HTMLAudioElement | null = null
    private enabled: boolean = true

    constructor() {
        if (typeof window !== 'undefined') {
            // Criar elemento de áudio
            this.audio = new Audio()
            this.audio.volume = 0.5

            // Usar data URI para som de notificação simples
            // Isso evita necessidade de arquivo externo
            this.audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eafTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs7y2Ik2CBlou+3mn00QDFC'

            // Carregar preferência do usuário
            const savedPref = localStorage.getItem('notification_sound_enabled')
            this.enabled = savedPref !== 'false'
        }
    }

    play() {
        if (this.audio && this.enabled) {
            this.audio.currentTime = 0
            this.audio.play().catch(err => {
                console.warn('Could not play notification sound:', err)
            })
        }
    }

    vibrate() {
        if ('vibrate' in navigator && this.enabled) {
            navigator.vibrate([200, 100, 200])
        }
    }

    notify() {
        this.play()
        this.vibrate()
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled
        localStorage.setItem('notification_sound_enabled', String(enabled))
    }

    isEnabled() {
        return this.enabled
    }
}

export const notificationSound = new NotificationSound()
