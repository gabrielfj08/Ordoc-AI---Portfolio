import * as React from 'react';
import { Field } from 'formik';
import { Typography } from 'printer-ui';
import { AttachPolicyToUserSelectProps } from './types';

const AttachPolicyToUserSelect = ({ users }: AttachPolicyToUserSelectProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Typography variant="headline" family="robotoMedium">
        Selecione o usuário:
      </Typography>
      <Field
        className="h-12 w-full border appearance-none border-gray rounded-md px-3 bg-white 
        font-roboto-400 text-[17px] focus:border-2 focus:outline-none focus:border-info"
        as="select"
        name="id"
      >
        <option value={0} className="hidden">
          Selecione um usuário
        </option>
        {users.map((user) => (
          <option key={user.id} value={user.id} className="font-roboto-400">
            {user.name}
          </option>
        ))}
      </Field>
    </div>
  );
};

export default AttachPolicyToUserSelect;
