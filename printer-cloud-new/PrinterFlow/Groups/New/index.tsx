import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Typography } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { GroupRequesterService } from '../../../services/printer-flow';
import NewGroupRequesterPage from './New';
import NewGroupRequesterForm from './form';
import NewGroupPageError from './Error';
import NewGroupPageSkeleton from './Skeleton';

const NewGroupRequesterPageContainer = () => {
  const { token, subdomain } = useAuth();
  const [isFormVisible, setFormVisibility] = React.useState<boolean>(false);
  const [isTreeVisible, setTreeVisibility] = React.useState<boolean>(false);
  const [groupId, setGroupId] = React.useState<number | null>(null);

  const { isError, isLoading, data } = useQuery({
    queryKey: ['newGroupRequester', token, subdomain],
    queryFn: () =>
      GroupRequesterService.index(token, subdomain, {
        perPage: 1000,
        order: 'created_at',
        direction: 'asc',
      }),
  });

  if (isError) {
    return <NewGroupPageError />;
  }

  if (isLoading) {
    return <NewGroupPageSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-3">
      <Typography variant="footnote1" family="robotoMedium">
        Selecione um grupo pai para visualizar seu organograma:
      </Typography>
      <div className="flex flex-wrap gap-4 h-full">
        {data.groupRequesters
          .filter((group) => !group.parentGroupId)
          .map((group) => {
            return (
              <button
                key={group.id}
                onClick={() => {
                  setTreeVisibility(true);
                  setGroupId(group.id);
                }}
                className="h-9 text-[15px] rounded-md px-[18px] border-[2.3px] space-x-2 undefined disabled:bg-gray/50 bg-yellow border-white/0 w-auto flex 
                items-center justify-center text-white text-left font-roboto font-roboto-400"
              >
                {group.code + '. ' + group.name}
              </button>
            );
          })}
        <Button
          label="Grupo pai"
          color="info"
          onClick={() => setFormVisibility(true)}
        >
          <Button.Icon
            alt="plus"
            name="plus"
            stroke
            color="white"
            w={24}
            h={24}
          />
        </Button>
      </div>
      <div className={isFormVisible ? 'block' : 'hidden'}>
        <NewGroupRequesterForm
          id={null}
          onCancel={() => {
            setFormVisibility(false);
          }}
        />
      </div>
      {isTreeVisible && (
        <div className="sm:pt-10">
          <NewGroupRequesterPage groupId={groupId} />
        </div>
      )}
    </div>
  );
};

export default NewGroupRequesterPageContainer;
