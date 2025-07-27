import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { GroupRequesterService } from '../../../services/printer-flow';
import { TreeItemProps } from './types';
import TreeSkeleton from './Skeleton';
import TreeItemContainer from './TreeView';
import NewGroupRequesterForm from '../../Groups/New/form';

const TreeItem = ({ label, id, status }: TreeItemProps) => {
  const { token, subdomain } = useAuth();
  const [showChildren, setShowChildren] = React.useState(false);

  const handleItemClick = () => {
    setShowChildren(!showChildren);
  };

  const [openInput, setOpenInput] = React.useState(false);

  const { isError, isLoading, data } = useQuery({
    queryKey: ['newGroupRequester', token, subdomain, id],
    queryFn: () => GroupRequesterService.showTree(token, subdomain, id),
  });

  if (isLoading) return <TreeSkeleton />;

  if (isError) return null;

  return (
    <>
      <div
        onClick={handleItemClick}
        className="h-16 flex items-center mb-4 px-5 rounded-lg shadow-default border border-lightGray w-full justify-between"
      >
        <div className="flex space-x-1 items-center">
          <Typography color={status === 'inactive' ? 'gray' : 'black'}>
            {label}
          </Typography>
          <Typography
            variant="footnote1"
            color={status === 'inactive' ? 'gray' : 'black'}
            className="italic"
          >
            {status === 'inactive' && '(inativo)'}
          </Typography>
        </div>
        <button
          className="w-fit h-9 pl-2 pr-4 bg-info rounded-md flex items-center justify-center truncate disabled:bg-gray/50"
          onClick={(e) => {
            showChildren && e.stopPropagation();
            setOpenInput(true);
          }}
          disabled={status === 'inactive' ? true : false}
        >
          <Icon alt="plus" name="plus" stroke color="white" w={22} h={22} />
          <Typography variant="footnote2" color="white" className="truncate">
            Criar grupo aqui
          </Typography>
        </button>
      </div>
      <ul className="ml-[5%] flex">
        {showChildren && (
          <div className="flex w-full">
            <div className="rounded-bl-lg border-l-2 border-b-2 border-lightGray h-12 w-14 -mt-4" />
            <div className="w-full">
              {data.children && data.children.length ? (
                <div>
                  <TreeItemContainer data={data.children} />
                </div>
              ) : (
                <div className="h-16 flex items-center mb-4 px-5 rounded-lg shadow-default border border-lightGray w-full space-x-2">
                  <Icon
                    alt="info"
                    name="info"
                    color="gray"
                    stroke
                    w={28}
                    h={28}
                  />
                  <Typography variant="footnote1" color="gray" align="center">
                    Você ainda não possui nenhum grupo aqui.
                  </Typography>
                </div>
              )}

              <div className="space-x-4 w-full flex items-end flex-col">
                {openInput && (
                  <NewGroupRequesterForm
                    setOpenInput={setOpenInput}
                    id={id}
                    onCancel={() => setOpenInput(false)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </ul>
    </>
  );
};

export default TreeItem;
