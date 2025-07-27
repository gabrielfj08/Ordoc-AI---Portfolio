import * as React from 'react';
import { ButtonV3 as Button, TypographyV3 as Typography } from 'printer-ui';
import {
  AuthExternalProvider,
  useExternalSession,
  useModal,
  useSession,
} from '../../hooks';
import { ShowProcedureProps } from './types';
import ProcedureStatusTag from './StatusTag';
import Info from '../components/Procedures/Info';
import ShowProcedureTabNavigation from './TabNavigation';
import PayloadValueFormatting from './PayloadValueFormatting';
import ShareProcedureModal from '../components/Procedures/ShareProcedure';
import FinishProcedureModal from '../components/Procedures/FinishProcedure';

const ShowProcedure = ({ procedure, generateReport }: ShowProcedureProps) => {
  const { themeColor } = useSession();
  const { openModal } = useModal();
  const { externalSession } = useExternalSession();

  return (
    <main>
      <div
        className={`w-full flex sm:items-center gap-2 sm:space-y-0 flex-col-reverse sm:flex-row ${
          procedure.requesterId !== externalSession?.user?.id
            ? 'sm:w-full sm:justify-end'
            : 'sm:justify-between'
        }`}
      >
        <span
          className={`sm:w-8/12 w-full  sm:space-x-2 sm:space-y-0 space-y-2 ${
            procedure.requesterId !== externalSession?.user?.id
              ? 'hidden'
              : 'sm:flex block'
          }  `}
        >
          <div className="sm:w-4/12 w-full">
            <Button
              style="outlined"
              size={`${window.innerWidth < 640 ? 'xs' : 'md'}`}
              color={themeColor}
              label="Compartilhar processo"
              rightIcon="sharedV3"
              w="full"
              onClick={() => {
                openModal(
                  <AuthExternalProvider>
                    <ShareProcedureModal procedure={procedure} />
                  </AuthExternalProvider>
                );
              }}
            />
          </div>
          <div className="sm:w-4/12 w-full">
            <Button
              style="outlined"
              size={`${window.innerWidth < 640 ? 'xs' : 'md'}`}
              color={themeColor}
              label="Gerar comprovante"
              rightIcon="printerV3"
              w="full"
              onClick={generateReport}
            />
          </div>
          <div className="sm:w-4/12 w-full">
            {procedure.status !== 'started' ? null : (
              <Button
                style="outlined"
                size={`${window.innerWidth < 640 ? 'xs' : 'md'}`}
                color={themeColor}
                label="Solicitar cancelamento"
                rightIcon="circleClose"
                w="full"
                onClick={() => {
                  openModal(
                    <AuthExternalProvider>
                      <FinishProcedureModal procedureId={procedure.id} />
                    </AuthExternalProvider>
                  );
                }}
              />
            )}
          </div>
        </span>
        <div className="flex space-x-2 items-center justify-end">
          <Typography variant="headline5" family="jakartaBold" color="darkGray">
            Status:
          </Typography>
          <ProcedureStatusTag status={procedure.status} />
        </div>
      </div>
      <div className="space-y-6 py-6">
        <Typography variant="headline4" family="jakartaBold" color={themeColor}>
          Dados do processo
        </Typography>
        <div
          className={`w-full p-2 sm:p-4 border border-${themeColor} rounded-lg space-y-1`}
        >
          <Info
            title="Data de criação:"
            content={new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'short',
            }).format(
              new Date(
                new Date(procedure.createdAt).toISOString().replace('.000Z', '')
              )
            )}
            color={themeColor}
          />
          <Info
            title="Solicitante:"
            content={procedure.requester.name}
            color={themeColor}
          />
          <Info
            title="Tipo de processo:"
            content={procedure.parentProcedureTemplateName}
            color={themeColor}
          />
          <Info
            title="Assunto do processo:"
            content={procedure.procedureTemplateName}
            color={themeColor}
          />
          <Info
            title="Grupo responsável:"
            content={procedure.responsibleGroup.name}
            color={themeColor}
          />
        </div>
        {procedure.payload.map((payloadItem) => (
          <div
            className={`w-full p-4 border border-${themeColor} rounded-lg`}
            key={payloadItem.label}
          >
            <div className="hidden sm:block">
              <Typography
                variant="bodyLg"
                family="jakartaBold"
                color={themeColor}
                align="start"
              >
                {payloadItem.label}
              </Typography>
            </div>
            <div className="sm:hidden">
              <Typography
                variant="bodyMd"
                family="jakartaBold"
                color={themeColor}
                align="start"
              >
                {payloadItem.label}
              </Typography>
            </div>
            <div className="hidden sm:block">
              <PayloadValueFormatting
                fieldType={payloadItem.fieldType}
                value={payloadItem.value}
                procedureId={procedure.id}
              />
            </div>
            <div className="sm:hidden">
              <PayloadValueFormatting
                fieldType={payloadItem.fieldType}
                value={payloadItem.value}
                procedureId={procedure.id}
              />
            </div>
          </div>
        ))}
      </div>
      <ShowProcedureTabNavigation />
    </main>
  );
};

export default ShowProcedure;
