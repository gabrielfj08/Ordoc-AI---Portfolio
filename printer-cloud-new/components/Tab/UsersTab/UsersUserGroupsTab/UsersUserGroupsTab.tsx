import * as React from 'react';
import { Tab } from '@headlessui/react';
import { useFormik } from 'formik';
import { Button, Icon, Input } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { UsersUserGroupsTabProps } from './types';
import UserGroupsList from '../../../List/UserGroups';
import AddUserGroup from '../../../Modal/User/AddUserGroup';

const UsersUserGroupTab = ({ userId, userGroup }: UsersUserGroupsTabProps) => {
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
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              label="Grupos"
              color="info"
              onClick={() => openModal(<AddUserGroup userGroups={userGroup} />)}
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
        <UserGroupsList
          q={formik.values.q}
          user_id={userId}
          policy={null}
          policy_id={''}
        />
      </div>
    </Tab.Panel>
  );
};

export default UsersUserGroupTab;
