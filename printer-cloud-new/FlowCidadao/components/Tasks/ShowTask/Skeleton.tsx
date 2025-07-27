import * as React from 'react';
import {
  ActionBoxV3 as ActionBox,
  Skeleton,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useModal, useSession } from '../../../../hooks';

const TaskInfoModalSkeleton = () => {
  const { themeColor } = useSession();
  const { closeModal } = useModal();

  return (
    <ActionBox onClose={closeModal} className="sm:w-[900px]">
      <ActionBox.Header
        title="Visualizar tarefa"
        subtitle="Aqui você pode visualizar os detalhes de sua tarefa."
        color={themeColor}
        icon="tasksV3"
        stroke
      />
      <ActionBox.Content className="space-y-4">
        <div className="flex space-x-2 items-center justify-end">
          <Typography variant="headline5" family="jakartaBold" color="darkGray">
            Status:
          </Typography>
          <Skeleton w={20} h={6} rounded="lg" />
        </div>
        <div
          className={`w-full px-4 py-2 border border-${themeColor} rounded-lg space-y-1`}
        >
          <div className="flex items-center space-x-2">
            <Typography
              variant="bodyMd"
              family="jakartaBold"
              color={themeColor}
              align="start"
            >
              Nome da tarefa:
            </Typography>
            <div className="w-4/12">
              <Skeleton w="full" h={4} rounded="lg" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Typography
              variant="bodyMd"
              family="jakartaBold"
              color={themeColor}
              align="start"
            >
              Criado por:
            </Typography>
            <div className="w-3/12">
              <Skeleton w="full" h={4} rounded="lg" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Typography
              variant="bodyMd"
              family="jakartaBold"
              color={themeColor}
              align="start"
            >
              Data:
            </Typography>
            <div className="w-3/12">
              <Skeleton w="full" h={4} rounded="lg" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Typography
              variant="bodyMd"
              family="jakartaBold"
              color={themeColor}
              align="start"
            >
              Responsável pela tarefa:
            </Typography>
            <div className="w-3/12">
              <Skeleton w="full" h={4} rounded="lg" />
            </div>
          </div>
        </div>
        <div
          className={`w-full px-4 py-2 border border-${themeColor} rounded-lg space-y-1`}
        >
          <div className="">
            <Typography
              variant="bodyMd"
              family="jakartaBold"
              color={themeColor}
              align="start"
            >
              Descrição:
            </Typography>
          </div>
          <Skeleton w="full" h={20} rounded="lg" />
        </div>
        <div
          className={`w-full px-4 py-2 border border-${themeColor} rounded-lg space-y-1`}
        >
          <Typography
            variant="bodyMd"
            family="jakartaBold"
            color={themeColor}
            align="start"
          >
            Anexos:
          </Typography>
          <Skeleton w="full" h={20} rounded="lg" />
        </div>
        <div
          className={`w-full px-4 py-2 border border-${themeColor} rounded-lg space-y-1`}
        >
          <Typography
            variant="bodyMd"
            family="jakartaBold"
            color={themeColor}
            align="start"
          >
            Comentários:
          </Typography>
          <Skeleton w="full" h={20} rounded="lg" />
        </div>
      </ActionBox.Content>
    </ActionBox>
  );
};

export default TaskInfoModalSkeleton;
