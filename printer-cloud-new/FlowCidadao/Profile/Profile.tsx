import * as React from 'react';
import {
  ButtonV3 as Button,
  TypographyV3 as Typography,
  Icon,
} from 'printer-ui';
import { AuthExternalProvider, useModal, useSession } from '../../hooks';
import { ExternalRequesterProfileProps } from './types';
import ShowExternalRequesterProfile from './Show';
import EditExternalRequesterProfile from './Edit';
import ChangePasswordModal from '../components/Profile/ChangePassword';

const ExternalRequesterProfile = ({
  externalRequester,
  type,
  setType,
}: ExternalRequesterProfileProps) => {
  const { themeColor } = useSession();
  const { openModal } = useModal();

  const profileMapping: any = {
    show: (
      <ShowExternalRequesterProfile
        externalRequester={externalRequester}
        color={themeColor}
      />
    ),
    edit: (
      <EditExternalRequesterProfile
        externalRequester={externalRequester}
        color={themeColor}
        setType={setType}
      />
    ),
  };

  return (
    <div className="w-full flex flex-col sm:my-6 sm:pr-10 sm:pl-20 px-4">
      <div className="px-2 sm:px-0">
        <div className="flex justify-start items-center">
          <Icon
            alt="Usuario"
            name="user"
            stroke
            color={themeColor}
            w={50}
            h={50}
            className="ml-[-10px]"
          />
          <Typography
            variant="headline3"
            family="jakartaBold"
            color={themeColor}
            align="end"
          >
            {externalRequester.name}
          </Typography>
        </div>
        <div
          className={`h-14 flex items-center border-${themeColor} border-b-2`}
        >
          <Typography
            variant="headline5"
            family="jakarta"
            color={themeColor}
            align="start"
          >
            Para alterar seu CPF, CNPJ ou sua data de nascimento, solicite
            diretamente na prefeitura.
          </Typography>
        </div>
      </div>
      <div className="space-y-2 mt-5 w-full">
        <div className="sm:hidden sm:justify-end justify-center items-center sm:space-x-4 space-y-2 sm:space-y-0 px-4 pb-4">
          {type === 'show' && (
            <Button
              color={themeColor}
              type="button"
              label="Editar dados"
              size="sm"
              w="full"
              onClick={() => setType('edit')}
            />
          )}
          <Button
            color={themeColor}
            type="button"
            label="Alterar senha"
            disabled={type === 'edit' && true}
            size="sm"
            w="full"
            onClick={() => {
              openModal(
                <AuthExternalProvider>
                  <ChangePasswordModal
                    externalRequesterId={externalRequester.id}
                  />
                </AuthExternalProvider>
              );
            }}
          />
        </div>
        <div className="hidden sm:flex sm:justify-end justify-center items-center sm:space-x-4 space-y-2 sm:space-y-0 pb-4">
          {type === 'show' && (
            <Button
              color={themeColor}
              type="button"
              label="Editar dados"
              w={56}
              onClick={() => setType('edit')}
            />
          )}
          <Button
            color={themeColor}
            type="button"
            label="Alterar senha"
            disabled={type === 'edit' && true}
            w={56}
            onClick={() => {
              openModal(
                <AuthExternalProvider>
                  <ChangePasswordModal
                    externalRequesterId={externalRequester.id}
                  />
                </AuthExternalProvider>
              );
            }}
          />
        </div>
      </div>
      {profileMapping[type]}
    </div>
  );
};

export default ExternalRequesterProfile;
