import * as React from 'react';
import { Button, Input, Icon } from 'printer-ui';
import { Tab } from '@headlessui/react';
import { useModal } from '../../../../hooks';
import AddPolicies from '../../../Modal/UserGroup/AddPolicies';
import PoliciesList from '../../../List/Policies';
import { useFormik } from 'formik';

const UserGroupPoliciesTab = ({ userGroup }) => {
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
              label="Permissões"
              color="info"
              onClick={() =>
                openModal(
                  <AddPolicies
                    organization_id={userGroup.organization_id}
                    group_id={userGroup.id}
                  />
                )
              }
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
        </div>
        <div className="w-fit">
          <PoliciesList
            userID={null}
            group_id={userGroup.id}
            organization_id={userGroup.organization_id}
            q={formik.values.q}
            group={userGroup}
          />
        </div>
      </div>
    </Tab.Panel>
  );
};
export default UserGroupPoliciesTab;
