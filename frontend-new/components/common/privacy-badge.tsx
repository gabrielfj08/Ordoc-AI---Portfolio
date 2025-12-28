import { ShieldCheck, Lock } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface PrivacyBadgeProps {
    className?: string
    collapsed?: boolean
}

export function PrivacyBadge({ className = "", collapsed = false }: PrivacyBadgeProps) {
    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={`
              inline-flex items-center gap-1.5 px-2 py-1 rounded-full 
              bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 
              hover:bg-emerald-500/20 transition-colors cursor-help
              ${className}
            `}
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {!collapsed && (
                            <span className="text-[10px] uppercase font-semibold tracking-wider">
                                Processamento Local - LGPD
                            </span>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px] p-3 text-xs bg-popover/95 backdrop-blur-sm border-emerald-500/20 shadow-lg">
                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2 text-emerald-600">
                            <Lock className="w-3 h-3" /> Privacidad Garantizada
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                            Todos os dados processados por esta IA permanecem no seu servidor local (On-Premise).
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">LGPD Compliant</span>
                            <span className="inline-block px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">Sem dados na Nuvem</span>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
