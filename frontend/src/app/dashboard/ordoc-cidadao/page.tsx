'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrdocCidadaoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portal do Cidadão</h1>
        <p className="text-muted-foreground">
          Interface para cidadãos solicitarem e acompanharem procedimentos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Novos Procedimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              +20% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+45</div>
            <p className="text-xs text-muted-foreground">
              +5% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Finalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+234</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assinaturas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Aguardando sua assinatura
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <CardDescription>
              Funcionalidades principais do portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <button className="flex items-center justify-start p-2 text-sm hover:bg-muted rounded-md">
                Novo Procedimento
              </button>
              <button className="flex items-center justify-start p-2 text-sm hover:bg-muted rounded-md">
                Meus Procedimentos
              </button>
              <button className="flex items-center justify-start p-2 text-sm hover:bg-muted rounded-md">
                Assinaturas Pendentes
              </button>
              <button className="flex items-center justify-start p-2 text-sm hover:bg-muted rounded-md">
                Perfil
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas atualizações em seus procedimentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">Procedimento #123 foi aprovado</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm">Assinatura pendente no procedimento #124</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">Procedimento #122 foi finalizado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
