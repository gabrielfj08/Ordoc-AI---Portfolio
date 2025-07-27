import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Field } from 'formik';
import { useAuth } from '../../../../hooks';
import { UserService } from '../../../../services';
import SelectUserSkeleton from './Skeleton';
import SelectUserError from './Error';

const SelectUserContainer = ({ name }) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['users', { token }],
    queryFn: () => UserService.index(token, subdomain, { perPage: 1000 }),
  });

  if (isLoading) return <SelectUserSkeleton />;

  if (isError) return <SelectUserError />;

  return (
    <Field
      component="select"
      name={name}
      className="block appearance-none w-full h-9 border pl-4 pr-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline truncate"
      options={[{ name: 'Qualquer pessoa', value: '*' }].concat(
        data.users.map((user) => ({
          name: user.username,
          value: String(user.id),
        }))
      )}
    >
      <option value="*">Qualquer pessoa</option>
      {data.users.map((user) => (
        <option value={`${user.id}`} key={user.id}>
          {user.username}
        </option>
      ))}
    </Field>
  );
};

export default SelectUserContainer;
