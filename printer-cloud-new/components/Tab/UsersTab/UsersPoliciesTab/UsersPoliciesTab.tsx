import * as React from 'react';
import { useFormik } from 'formik';
import { Tab } from '@headlessui/react';
import { Button, Input, Icon } from 'printer-ui';
import { useModal } from '../../../../hooks';
import PoliciesList from '../../../List/Policies';
import AddPoliciesUser from '../../../Modal/User/AddPolicies';

const UsersPoliciesTab = ({ user_id }) => {
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
              label="Permissões"
              color="info"
              onClick={() => openModal(<AddPoliciesUser userId={user_id} />)}
            >
              <Button.Icon
                name="plus"
                alt="plus"
                color="white"
                fill
                stroke
                w={20}
                h={20}
              />
            </Button>
          </div>
          <Input
            size="md"
            type="search"
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
        <PoliciesList
          group={{
            id: null,
            name: '',
            description: '',
            organization_id: null,
            status: 'active' || 'inactive',
            users_count: null,
            created_at: '',
            updated_at: '',
            policies_count: null,
            organization: {
              corporate_name: '',
            },
          }}
          q={formik.values.q}
          userID={user_id}
          group_id={null}
          organization_id={null}
        />
      </div>
    </Tab.Panel>
  );
};
export default UsersPoliciesTab;
