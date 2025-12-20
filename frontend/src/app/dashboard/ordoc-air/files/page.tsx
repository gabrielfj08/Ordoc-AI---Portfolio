'use client';

import React, { useState } from 'react';
import {
    FileText,
    FileIcon,
    FileImage,
    FileSpreadsheet,
    MoreVertical,
    Download,
    Trash2,
    Share2,
    Filter,
    Search,
    UploadCloud
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock Data for Files (Flat View)
const initialFiles = [
    { id: 1, name: 'Fatura_Jan_2025.pdf', type: 'PDF', size: '2.4 MB', category: 'Financeiro', author: 'Ricardo Silva', date: '21/12/2024' },
    { id: 2, name: 'Contrato_Cliente_X.docx', type: 'DOCX', size: '1.8 MB', category: 'Jurídico', author: 'Ana Souza', date: '20/12/2024' },
    { id: 3, name: 'Logo_Horizontal.png', type: 'PNG', size: '450 KB', category: 'Marketing', author: 'Design Team', date: '19/12/2024' },
    { id: 4, name: 'Planilha_Orcamento_2025.xlsx', type: 'XLSX', size: '5.2 MB', category: 'Financeiro', author: 'Carlos Reis', date: '18/12/2024' },
    { id: 5, name: 'Manual_Operacional_v3.pdf', type: 'PDF', size: '12.4 MB', category: 'Operacional', author: 'Ricardo Silva', date: '15/12/2024' },
    { id: 6, name: 'Apresentacao_Institucional.pptx', type: 'PPTX', size: '8.9 MB', category: 'Comercial', author: 'Ana Souza', date: '14/12/2024' },
    { id: 7, name: 'Holerites_Dezembro.pdf', type: 'PDF', size: '3.1 MB', category: 'RH', author: 'RH Dept', date: '10/12/2024' },
];

const getFileIcon = (type: string) => {
    switch (type) {
        case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
        case 'DOCX': return <FileIcon className="h-5 w-5 text-blue-500" />;
        case 'XLSX': return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
        case 'PNG':
        case 'JPG': return <FileImage className="h-5 w-5 text-purple-500" />;
        default: return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
};

export default function FilesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [files, setFiles] = useState(initialFiles);

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Arquivos</h2>
                        <p className="text-muted-foreground">
                            Visão geral de todos os arquivos armazenados na plataforma.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Upload Arquivo
                        </Button>
                    </div>
                </div>

                <div className="flex items-center space-x-2 py-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar arquivos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Button variant="outline" className="ml-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Todos os Arquivos</CardTitle>
                        <CardDescription>
                            Listagem completa sem hierarquia de pastas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Arquivo</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Tamanho</TableHead>
                                    <TableHead>Autor</TableHead>
                                    <TableHead>Data Modificação</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFiles.map((file) => (
                                    <TableRow key={file.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-3">
                                                {getFileIcon(file.type)}
                                                <span>{file.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{file.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{file.size}</TableCell>
                                        <TableCell>{file.author}</TableCell>
                                        <TableCell>{file.date}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Baixar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Share2 className="mr-2 h-4 w-4" />
                                                        Compartilhar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
