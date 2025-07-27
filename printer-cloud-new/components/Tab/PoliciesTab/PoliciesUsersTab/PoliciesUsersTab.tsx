import * as React from 'react';
import { Tab } from '@headlessui/react';
import { useFormik } from 'formik';
import { useModal } from '../../../../hooks';
import { Button, Icon, Input } from 'printer-ui';
import UsersList from '../../../List/Users';
import AttachToUser from '../../../Modal/Policy/AttachToUser';

const PoliciesUsersTab = ({ policy }) => {
  const { openModal } = useModal();
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  const formik = useFormik({
    initialValues: {
      q: '',
    },
    onSubmit: () => {},
  });

  return (
    <Tab.Panel
      className={classNames('rounded-lg p-3 flex h-full', 'focus:outline-none')}
    >
      <div className="space-y-4 pt-4 w-full h-fit">
        <div className="flex flex-col space-y-4 items-end w-full h-full">
          <form onSubmit={formik.handleSubmit} className="w-full space-y-4">
            <div className="flex justify-end">
              <Button
                type="button"
                label="Usuários"
                color="info"
                onClick={() => openModal(<AttachToUser policy={policy} />)}
              >
                <Button.Icon
                  alt="plus"
                  name="plus"
                  color="white"
                  fill
                  stroke
                  w={20}
                  h={20}
                />
              </Button>
            </div>
            <Input
              type="search"
              size="md"
              name="q"
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
        <div className="w-full">
          <UsersList
            userGroup={null}
            groupID={null}
            q={formik.values.q}
            policy={policy}
            policy_id={policy.id}
          />
        </div>
      </div>
    </Tab.Panel>
  );
};

export default PoliciesUsersTab;
