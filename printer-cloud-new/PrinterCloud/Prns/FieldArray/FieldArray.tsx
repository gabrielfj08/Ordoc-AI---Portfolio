import * as React from 'react';
import { useFormikContext, FormikContextType, Field, FieldArray } from 'formik';
import { Button, Input, Icon } from 'printer-ui';
import { useSession } from '../../../hooks';
import { PrnFieldArrayProps } from './types';
import { NewPolicyFormValues } from '../../Policies/New/types';

const PrnFieldArray = ({ disabled }: PrnFieldArrayProps) => {
  const { values, setFieldValue }: FormikContextType<NewPolicyFormValues> =
    useFormikContext();

  const { session } = useSession();

  return (
    <div>
      <FieldArray name="resource">
        {({ push, remove }) => (
          <div>
            {values.resource.map((value, index) => (
              <div
                key={index}
                className="w-full flex items-center space-x-1 my-2"
              >
                <div
                  className={`md:block hidden ${
                    disabled ? 'w-full' : 'w-11/12'
                  }`}
                >
                  <Input
                    size="md"
                    w="full"
                    name={`resource[${index}]`}
                    value={value}
                    onChange={(e) => {
                      setFieldValue(`resource[${index}]`, e.target.value);
                    }}
                    disabled={disabled}
                  />
                </div>
                <div
                  className={`block md:hidden ${
                    disabled ? 'w-full' : 'w-11/12'
                  }`}
                >
                  <Input
                    size="sm"
                    w="full"
                    name={`resource[${index}]`}
                    value={value}
                    onChange={(e) => {
                      setFieldValue(`resource[${index}]`, e.target.value);
                    }}
                    disabled={disabled}
                  />
                </div>
                {!disabled && (
                  <button
                    type="button"
                    disabled={false}
                    onClick={() => remove(index)}
                  >
                    <Icon
                      name="close"
                      alt="close"
                      color="gray"
                      w={25}
                      h={25}
                      fill
                      stroke
                    />
                  </button>
                )}
              </div>
            ))}
            {!disabled && (
              <Button
                type="button"
                color="info"
                label="Opção"
                onClick={() =>
                  push(
                    `prn:${values.service}:${session?.organization?.cnpj}:` ||
                      ''
                  )
                }
              >
                <Button.Icon
                  w={20}
                  h={20}
                  name="plus"
                  alt="plus"
                  color="white"
                  stroke
                  fill
                />
              </Button>
            )}
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default PrnFieldArray;
