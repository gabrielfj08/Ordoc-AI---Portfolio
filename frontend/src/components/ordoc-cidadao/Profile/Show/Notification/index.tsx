'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare } from 'lucide-react';

interface ShowNotificationExternalRequesterProfileProps {
  externalRequester: {
    notifications?: {
      email: boolean;
      sms: boolean;
    };
  };
}

const ShowNotificationExternalRequesterProfile = ({ externalRequester }: ShowNotificationExternalRequesterProfileProps) => {
  const { notifications } = externalRequester;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600">Preferências de Notificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Email:</span>
            </div>
            <Badge variant={notifications?.email ? 'default' : 'secondary'}>
              {notifications?.email ? 'Ativado' : 'Desativado'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">SMS:</span>
            </div>
            <Badge variant={notifications?.sms ? 'default' : 'secondary'}>
              {notifications?.sms ? 'Ativado' : 'Desativado'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowNotificationExternalRequesterProfile;
