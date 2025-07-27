import * as React from 'react';
import { Paper, Typography } from 'printer-ui';

const RadioButton = ({ name, value, id, className }) => {
  return (
    <label htmlFor={id}>
      <Paper
        elevation={2}
        w={32}
        h={12}
        // className={`cursor-pointer flex min-h-[40px] rounded-lg space-x-2 items-center justify-center text-center w-full shadow-lg px-4 py-3`}
      >
        <input
          // className="cursor-pointer"
          type="radio"
          id={id}
          name={name}
          value={value}
        />
        <Typography variant="footnote1" className="leading-5 cursor-pointer">
          {name}
        </Typography>
      </Paper>
    </label>
  );
};

export default RadioButton;
