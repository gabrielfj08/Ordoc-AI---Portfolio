"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

export interface FilterConfig {
    type: boolean
    people: boolean
    modified: boolean
    location: boolean
    source: boolean
    sortOptions: string[]
}

export const filtersBySection: Record<string, FilterConfig> = {
    "meu-drive": {
        type: true,
        people: true,
        modified: true,
        location: false,
        source: true,
        sortOptions: ["Nome", "Última modificação", "Última abertura por mim"],
    },
    prioridades: {
        type: true,
        people: false,
        modified: true,
        location: false,
        source: false,
        sortOptions: ["Nome", "Última modificação", "Prioridade"],
    },
    pendentes: {
        type: true,
        people: false,
        modified: true,
        location: false,
        source: false,
        sortOptions: ["Nome", "Última modificação", "Data de criação"],
    },
    compartilhados: {
        type: true,
        people: true,
        modified: true,
        location: false,
        source: true,
        sortOptions: ["Data do compartilhamento", "Nome", "Última modificação"],
    },
    templates: {
        type: true,
        people: false,
        modified: true,
        location: false,
        source: false,
        sortOptions: ["Nome", "Última modificação", "Categoria"],
    },
    lixeira: {
        type: true,
        people: false,
        modified: true,
        location: false,
        source: false,
        sortOptions: ["Nome", "Data de exclusão", "Última modificação"],
    },
}

interface DocumentFiltersProps {
    selectedSection: string
}

export function DocumentFilters({ selectedSection }: DocumentFiltersProps) {
    const config = filtersBySection[selectedSection] || filtersBySection["meu-drive"]
    const [selectedType, setSelectedType] = useState<string>("Todos os tipos")
    const [selectedPeople, setSelectedPeople] = useState<string>("Qualquer pessoa")
    const [selectedModified, setSelectedModified] = useState<string>("Qualquer momento")
    const [selectedLocation, setSelectedLocation] = useState<string>("Qualquer local")
    const [selectedSource, setSelectedSource] = useState<string>("Qualquer fonte")
    const [sortBy, setSortBy] = useState<string>(config.sortOptions[0])
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    const toggleSortDirection = () => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* Filtro: Tipo */}
            {config.type && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
                            <span className="text-sm">Tipo</span>
                            <ChevronDown className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel>Tipo de arquivo</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedType("Todos os tipos")}>
                            Todos os tipos
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedType("Documentos")}>
                            Documentos
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedType("Planilhas")}>
                            Planilhas
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedType("Apresentações")}>
                            Apresentações
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedType("PDFs")}>PDFs</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedType("Imagens")}>Imagens</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedType("Vídeos")}>Vídeos</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* Filtro: Pessoas */}
            {config.people && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
                            <span className="text-sm">Pessoas</span>
                            <ChevronDown className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel>Proprietário</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedPeople("Qualquer pessoa")}>
                            Qualquer pessoa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedPeople("Meus arquivos")}>
                            Meus arquivos
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedPeople("Não sou o proprietário")}>
                            Não sou o proprietário
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* Filtro: Modificado */}
            {config.modified && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
                            <span className="text-sm">Modificado</span>
                            <ChevronDown className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel>Data de modificação</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedModified("Qualquer momento")}>
                            Qualquer momento
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedModified("Hoje")}>Hoje</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedModified("Últimos 7 dias")}>
                            Últimos 7 dias
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedModified("Últimos 30 dias")}>
                            Últimos 30 dias
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedModified("Este ano")}>
                            Este ano
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* Filtro: Local */}
            {config.location && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
                            <span className="text-sm">Local</span>
                            <ChevronDown className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel>Localização</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedLocation("Qualquer local")}>
                            Qualquer local
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedLocation("Meu Drive")}>
                            Meu Drive
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedLocation("Compartilhados comigo")}>
                            Compartilhados comigo
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* Filtro: Fonte */}
            {config.source && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
                            <span className="text-sm">Fonte</span>
                            <ChevronDown className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel>Origem do arquivo</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedSource("Qualquer fonte")}>
                            Qualquer fonte
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedSource("Upload manual")}>
                            Upload manual
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedSource("Gerado por IA")}>
                            Gerado por IA
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedSource("Importado")}>
                            Importado
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* Separador visual */}
            <div className="h-6 w-px bg-border mx-1" />

            {/* Ordenação */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
                        <span className="text-sm">{sortBy}</span>
                        <ChevronDown className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {config.sortOptions.map((option) => (
                        <DropdownMenuItem key={option} onClick={() => setSortBy(option)}>
                            {option}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Botão de direção da ordenação */}
            <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full"
                onClick={toggleSortDirection}
                title={sortDirection === "asc" ? "Ordem crescente" : "Ordem decrescente"}
            >
                {sortDirection === "asc" ? (
                    <ArrowUp className="size-4" />
                ) : (
                    <ArrowDown className="size-4" />
                )}
            </Button>
        </div>
    )
}
