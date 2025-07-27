import * as React from 'react';
import { IndeterminateCheckboxProps } from './types';

const IndeterminateCheckbox = ({
  indeterminate,
  value,
  name,
  className = '',
  ...rest
}: IndeterminateCheckboxProps & React.HTMLProps<HTMLInputElement>) => {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <div className="flex space-x-1">
      <input
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={value}
        name={name}
        type="checkbox"
        ref={ref}
        className={className + ' cursor-pointer'}
        {...rest}
      />
    </div>
  );
};

export default IndeterminateCheckbox;
