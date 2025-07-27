import * as React from 'react';
import router from 'next/router';
import { Card, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';
import { CardsProps } from '../types';

const Cards = ({ reportData, handleClick }: CardsProps) => {
  const { themeColor } = useSession();

  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-7 my-8 ">
      <Card
        title="Processos"
        icon="proceduresV3"
        w="full"
        color={themeColor}
        onClick={handleClick}
        opened
        buttonLabel="Atualizar"
      >
        <div className="w-full h-12 flex flex-col items-center justify-center">
          <div
            className="cursor-pointer"
            onClick={() =>
              router.push('/flow-cidadao/procedures?status=running')
            }
          >
            <Typography
              variant="bodyMd"
              family="jakartaBold"
              color={themeColor}
              align="center"
            >
              {reportData.proceduresRunningCount} em análise
            </Typography>
          </div>
          <div
            className="cursor-pointer"
            onClick={() =>
              router.push('/flow-cidadao/procedures?status=started')
            }
          >
            <Typography
              variant="bodyMd"
              family="jakartaBold"
              color={themeColor}
              align="center"
            >
              {reportData.proceduresStartedCount} tramitando
            </Typography>
          </div>
        </div>
      </Card>
      <Card
        title="Tarefas"
        w="full"
        icon="tasksV3"
        color={themeColor}
        onClick={handleClick}
        opened
        buttonLabel="Atualizar"
      >
        <div className="w-full grid justify-center h-12 items-center">
          <div
            className="cursor-pointer"
            onClick={() => router.push('/flow-cidadao/tasks?status=running')}
          >
            <Typography
              variant="bodyMd"
              family="jakartaBold"
              color={themeColor}
              align="center"
            >
              {reportData.tasksRunningCount}
              &nbsp;&nbsp;
              {reportData.tasksRunningCount === 1 ? 'pendente' : 'pendentes'}
            </Typography>
          </div>
        </div>
      </Card>
      <Card
        title="Assinaturas"
        icon="signaturesV3"
        w="full"
        color={themeColor}
        onClick={handleClick}
        opened
        buttonLabel="Atualizar"
      >
        <div className="w-full grid justify-center h-12 items-center">
          <div
            className="cursor-pointer"
            onClick={() =>
              router.push('/flow-cidadao/signatures?status=created')
            }
          >
            <Typography
              variant="bodyMd"
              family="jakartaBold"
              color={themeColor}
              align="center"
            >
              {reportData.signaturesPendingCount}
              &nbsp;&nbsp;
              {reportData.signaturesPendingCount === 1
                ? 'pendente'
                : 'pendentes'}
            </Typography>
          </div>
        </div>
      </Card>
      <Card
        title="Compartilhamentos"
        icon="sharedV3"
        w="full"
        color={themeColor}
        onClick={handleClick}
        opened
        buttonLabel="Atualizar"
      >
        <div className="w-full grid justify-center h-12 items-center">
          <div
            className="cursor-pointer"
            onClick={() => router.push('/flow-cidadao/shared')}
          >
            <Typography
              variant="bodyMd"
              family="jakartaBold"
              color={themeColor}
              align="center"
            >
              {reportData.sharedProceduresPendingCount}
              &nbsp;&nbsp;
              {reportData.sharedProceduresPendingCount === 1
                ? 'pendente'
                : 'pendentes'}
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default Cards;
