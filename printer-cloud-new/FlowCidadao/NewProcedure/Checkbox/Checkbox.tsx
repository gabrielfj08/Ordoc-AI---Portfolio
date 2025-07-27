import * as React from 'react';
import { CheckboxV3 as Checkbox, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';
import { ProcedureCheckboxProps } from './types';

const ProcedureCheckbox = ({ formik }: ProcedureCheckboxProps) => {
  const { themeColor } = useSession();

  return (
    <div
      className={`flex items-center justify-center relative space-x-2 pt-6 border-t-2 border-${themeColor}`}
    >
      <label
        id="checkbox"
        className="cursor-pointer flex justify-center items-center space-x-2"
      >
        <div>
          <Checkbox
            color={themeColor}
            id="checkbox"
            name="checkbox"
            onChange={formik.handleChange}
            value={formik.values.checkbox}
          />
        </div>
        <Typography
          family="jakartaMedium"
          variant="bodyMd"
          color="darkGray"
          align="center"
        >
          Estou ciente que estou criando um processo e os campos não poderão ser
          editados posteriormente.
        </Typography>
      </label>
    </div>
  );
};

export default ProcedureCheckbox;
