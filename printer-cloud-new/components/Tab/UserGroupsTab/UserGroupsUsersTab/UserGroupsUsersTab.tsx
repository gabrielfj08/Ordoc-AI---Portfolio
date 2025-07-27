import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Button, Icon, Input } from 'printer-ui';
import UsersList from '../../../List/Users';
import { useFormik } from 'formik';
import { useModal } from '../../../../hooks';
import AddUser from '../../../Modal/UserGroup/AddUser';

const UserGroupUsersTab = ({ userGroupID, userGroup }) => {
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
          <div>
            <Button
              label="Usuários"
              color="info"
              onClick={() => openModal(<AddUser userGroup={userGroup} />)}
            >
              <Button.Icon
                name="plus"
                alt="plus"
                color="white"
                fill
                stroke
                w="20"
                h="20"
              />
            </Button>
          </div>
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
        <div className="w-full">
          <UsersList
            groupID={userGroupID}
            q={formik.values.q}
            userGroup={userGroup}
            policy={null}
            policy_id={null}
          />
        </div>
      </div>
    </Tab.Panel>
  );
};

export default UserGroupUsersTab;
