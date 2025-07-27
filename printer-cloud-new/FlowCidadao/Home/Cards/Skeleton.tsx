import * as React from 'react';
import { Card, Skeleton } from 'printer-ui';
import { useSession } from '../../../hooks';

const CardsSkeleton = () => {
  const { themeColor } = useSession();

  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-7 my-8 ">
      <Card
        title="Processos"
        icon="proceduresV3"
        w="full"
        color={themeColor}
        onClick={() => {}}
        opened
        buttonLabel=""
        disabledButton
      >
        <div className="w-full h-12 flex flex-col items-center justify-center space-y-2">
          <Skeleton w={28} h={5} rounded="default" />
          <Skeleton w={24} h={5} rounded="default" />
        </div>
      </Card>
      <Card
        title="Tarefas"
        w="full"
        icon="tasksV3"
        color={themeColor}
        onClick={() => {}}
        opened
        buttonLabel=""
        disabledButton
      >
        <div className="w-full grid justify-center h-12 items-center">
          <Skeleton w={28} h={5} rounded="default" />
        </div>
      </Card>
      <Card
        title="Assinaturas"
        icon="signaturesV3"
        w="full"
        color={themeColor}
        onClick={() => {}}
        opened
        buttonLabel=""
        disabledButton
      >
        <div className="w-full grid justify-center h-12 items-center">
          <Skeleton w={28} h={5} rounded="default" />
        </div>
      </Card>
      <Card
        title="Compartilhamentos"
        icon="sharedV3"
        w="full"
        color={themeColor}
        onClick={() => {}}
        opened
        buttonLabel=""
        disabledButton
      >
        <div className="w-full grid justify-center h-12 items-center">
          <Skeleton w={28} h={5} rounded="default" />
        </div>
      </Card>
    </div>
  );
};
export default CardsSkeleton;
