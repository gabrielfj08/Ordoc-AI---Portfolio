'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { ExternalRequesterProfileProps } from './types';
import ShowExternalRequesterProfile from './Show';
import EditExternalRequesterProfile from './Edit';
import ChangePasswordModal from './components/Profile/ChangePassword';

const ExternalRequesterProfile = ({
  externalRequester,
  type,
  setType,
}: ExternalRequesterProfileProps) => {
  const [showChangePassword, setShowChangePassword] = React.useState(false);

  const profileMapping: any = {
    show: (
      <ShowExternalRequesterProfile
        externalRequester={externalRequester}
      />
    ),
    edit: (
      <EditExternalRequesterProfile
        externalRequester={externalRequester}
        setType={setType}
      />
    ),
  };

  return (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-blue-600 text-xl">
              {externalRequester.name}
            </CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Para alterar seu CPF, CNPJ ou sua data de nascimento, solicite
            diretamente na prefeitura.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-end mb-6">
            {type === 'show' && (
              <Button
                variant="outline"
                onClick={() => setType('edit')}
              >
                Editar dados
              </Button>
            )}
            <Button
              variant="outline"
              disabled={type === 'edit'}
              onClick={() => setShowChangePassword(true)}
            >
              Alterar senha
            </Button>
          </div>

          {profileMapping[type]}

          {showChangePassword && (
            <ChangePasswordModal
              externalRequesterId={externalRequester.id}
              onClose={() => setShowChangePassword(false)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalRequesterProfile;
