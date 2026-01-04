import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useMyDayStore } from "@/stores/my-day-store"
import { Users, User } from "lucide-react"

interface UserPreferencesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UserPreferencesDialog({ open, onOpenChange }: UserPreferencesDialogProps) {
    const { viewMode, canAccessTeamView, setViewMode } = useMyDayStore()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Preferências do Usuário</DialogTitle>
                    <DialogDescription>
                        Personalize sua experiência no Ordoc AI.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {canAccessTeamView && (
                        <div className="space-y-4">
                            <Label className="text-base font-medium">Modo de Visualização</Label>
                            <RadioGroup
                                value={viewMode}
                                onValueChange={(value) => setViewMode(value as 'personal' | 'team')}
                                className="grid gap-4"
                            >
                                <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="personal" id="personal" />
                                    <Label htmlFor="personal" className="flex-1 flex items-center cursor-pointer">
                                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">Minha Visão</span>
                                            <span className="text-xs text-muted-foreground">Foco em suas tarefas e documentos</span>
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="team" id="team" />
                                    <Label htmlFor="team" className="flex-1 flex items-center cursor-pointer">
                                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">Visão da Equipe</span>
                                            <span className="text-xs text-muted-foreground">Foco em gargalos e atividades do time</span>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    {!canAccessTeamView && (
                        <div className="p-4 border rounded-md bg-muted/20">
                            <p className="text-sm text-muted-foreground text-center">
                                Você está visualizando o modo <strong>Minha Visão</strong>.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
