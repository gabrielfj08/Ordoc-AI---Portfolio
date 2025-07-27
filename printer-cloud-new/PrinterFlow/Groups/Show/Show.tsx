import * as React from 'react';
import { useFormik } from 'formik';
import { Button, Icon, Input, Typography } from 'printer-ui';
import { ShowGroupProps } from './types';
import { useModal } from '../../../hooks';
import AddRequestersModal from '../../Groups/Modals/AddRequesters';
import RequestersList from '../../components/Requesters/List';

const ShowGroup = ({ group, groupId }: ShowGroupProps) => {
  const { openModal } = useModal();
  const formik = useFormik({
    initialValues: {
      q: '',
    },
    onSubmit: () => {},
  });

  return (
    <div className="w-full sm:flex sm:justify-between">
      <div className="sm:w-4/12 space-y-4 sm:mt-0 mt-5 mx-5 sm:mx-0">
        <Typography variant="title2" family="robotoMedium">
          Dados do grupo
        </Typography>
        <div className="sm:mr-0 h-fit rounded-lg justify-left items-center bg-lighterGray border border-lightGray shadow-default">
          <div className="m-4 space-y-4">
            <div className="flex space-x-2 w-[100%]">
              <Typography variant="footnote1" family="robotoMedium">
                Nome do grupo:
              </Typography>
              <Typography variant="footnote1" family="roboto">
                {group.name}
              </Typography>
            </div>
            <div className="flex space-x-2 w-[100%]">
              <Typography variant="footnote1" family="robotoMedium">
                Código do grupo:
              </Typography>
              <Typography variant="footnote1" family="roboto">
                {group.code}
              </Typography>
            </div>
            {group.ancestorGroupTree.length ? (
              <div className="flex space-x-2 w-[100%]">
                <Typography variant="footnote1" family="robotoMedium">
                  Filiação:
                </Typography>
                <Typography variant="footnote1" family="roboto">
                  {
                    group.ancestorGroupTree[group.ancestorGroupTree.length - 1]
                      ?.code
                  }{' '}
                  -{' '}
                  {
                    group.ancestorGroupTree[group.ancestorGroupTree.length - 1]
                      ?.name
                  }
                </Typography>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="md:w-6/12 w-10/12 mx-10 space-y-4 mt-5 sm:mt-0">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <Button
            label="Solicitante interno"
            size="md"
            color="info"
            className="md:w-4/12 w-11/12"
            onClick={() => openModal(<AddRequestersModal groupId={groupId} />)}
            disabled={group.status === 'inactive'}
          >
            <Button.Icon
              alt="plus"
              name="plus"
              color="white"
              fill
              stroke
              h={23}
              w={23}
            />
          </Button>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className="w-full">
            <Input
              name="q"
              type="search"
              value={formik.values.q}
              onChange={formik.handleChange}
              float
              w="full"
            >
              <Icon
                name="search"
                alt="search"
                color="gray"
                fill
                stroke
                w={28}
                h={28}
              />
            </Input>
          </form>
        </div>
        <div className="md:h-96 h-80 overflow-y-auto divide-y divide-lightGray border border-lightGray">
          <RequestersList
            groupId={groupId}
            groupName={group.name}
            status={group.status}
            q={formik.values.q}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowGroup;
