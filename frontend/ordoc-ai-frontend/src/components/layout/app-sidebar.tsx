'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Shield,
  UserCircle,
  FileText,
  Folder,
  FileStack,
  Search,
  Workflow,
  ClipboardList,
  CheckSquare,
  FileSignature,
  MessageSquare,
  FileCheck,
  FileClock,
  History,
  BarChart3,
  TrendingUp,
  Download,
  Building2,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/layout/theme-toggle'

// Navigation structure with intuitive names (no "Ordoc" prefix)
const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Controle de Acesso',
    icon: Shield,
    items: [
      { title: 'Usuários', url: '/dashboard/ordoc-cloud/users', icon: Users },
      { title: 'Grupos', url: '/dashboard/ordoc-cloud/groups', icon: UserCircle },
      { title: 'Permissões', url: '/dashboard/ordoc-cloud/permissions', icon: Shield },
      { title: 'Perfis', url: '/dashboard/ordoc-cloud/profiles', icon: Users },
      { title: 'Auditoria', url: '/dashboard/ordoc-cloud/audit', icon: FileText },
    ],
  },
  {
    title: 'Gestão Documental',
    icon: FileText,
    items: [
      { title: 'Documentos', url: '/dashboard/ordoc-air/documents', icon: FileStack },
      { title: 'Categorias', url: '/dashboard/ordoc-air/categories', icon: Folder },
      { title: 'Templates', url: '/dashboard/ordoc-air/templates', icon: FileText },
      { title: 'Arquivos', url: '/dashboard/ordoc-air/files', icon: FileStack },
      { title: 'Busca Avançada', url: '/dashboard/ordoc-air/search', icon: Search },
    ],
  },
  {
    title: 'Fluxo de Trabalho',
    icon: Workflow,
    items: [
      { title: 'Procedimentos', url: '/dashboard/ordoc-flow/procedures', icon: ClipboardList },
      { title: 'Tarefas', url: '/dashboard/ordoc-flow/tasks', icon: CheckSquare },
      { title: 'Templates de Processo', url: '/dashboard/ordoc-flow/procedure-templates', icon: FileText },
      { title: 'Solicitantes', url: '/dashboard/ordoc-flow/requesters', icon: Users },
      { title: 'Grupos', url: '/dashboard/ordoc-flow/groups', icon: UserCircle },
      { title: 'Assuntos', url: '/dashboard/ordoc-flow/subjects', icon: MessageSquare },
    ],
  },
  {
    title: 'Portal Público',
    icon: Building2,
    items: [
      { title: 'Solicitações Públicas', url: '/dashboard/ordoc-cidadao/requests', icon: ClipboardList },
      { title: 'Acompanhamento', url: '/dashboard/ordoc-cidadao/tracking', icon: Search },
      { title: 'Consultas', url: '/dashboard/ordoc-cidadao/queries', icon: MessageSquare },
    ],
  },
  {
    title: 'Assinatura Digital',
    icon: FileSignature,
    items: [
      { title: 'Documentos para Assinar', url: '/dashboard/ordoc-sign/pending', icon: FileClock },
      { title: 'Assinados', url: '/dashboard/ordoc-sign/signed', icon: FileCheck },
      { title: 'Histórico', url: '/dashboard/ordoc-sign/history', icon: History },
    ],
  },
  {
    title: 'Relatórios e Analytics',
    icon: BarChart3,
    items: [
      { title: 'Dashboard', url: '/dashboard/ordoc-reports', icon: LayoutDashboard },
      { title: 'Métricas', url: '/dashboard/ordoc-reports/metrics', icon: TrendingUp },
      { title: 'Exportações', url: '/dashboard/ordoc-reports/exports', icon: Download },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  // User data (will be fetched from API in the future)
  const user = {
    name: 'Usuário Admin',
    email: 'admin@ordoc.ai',
    avatar: '',
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">OrdocAI</span>
                  <span className="text-xs text-muted-foreground">
                    Gestão Inteligente
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (!item.items) {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url!}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                const isGroupActive = item.items.some(
                  (subItem) => pathname === subItem.url
                )

                return (
                  <Collapsible
                    key={item.title}
                    defaultOpen={isGroupActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => {
                            const isActive = pathname === subItem.url
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={isActive}>
                                  <Link href={subItem.url}>
                                    <subItem.icon className="size-4" />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-center pb-2">
            <ThemeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="rounded-lg">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
