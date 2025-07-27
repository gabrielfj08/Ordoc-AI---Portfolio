import * as React from 'react';
import { ActionBox, Button } from 'printer-ui';
import { FilterButtonProps } from './types';

const OrganizationFilter = ({
  children,
  status,
  onReset,
  onClick,
}: FilterButtonProps) => {
  const [isDropdownVisible, setDropdownVisibility] = React.useState(false);
  const closeButtonVisibility = status ? null : 'hidden';
  const closeButtonClassName = `${closeButtonVisibility} px-0 rounded-l-none`;
  const dropDownClassname = isDropdownVisible ? 'absolute z-20' : 'hidden';

  const toggleDropdownVisibility = () => {
    setDropdownVisibility((current) => !current);
  };

  const isFilterActive = () => {
    if (status) {
      return true;
    }
  };

  const handleClick = () => {
    onClick();
    toggleDropdownVisibility();
  };

  return (
    <div className="w-fit h-fit">
      <div className="flex justify-end">
        <Button
          color={isFilterActive() ? 'red' : 'info'}
          label={isFilterActive() ? 'Limpar filtro' : 'Filtrar'}
          type="button"
          className={isFilterActive() ? 'rounded-r-none pr-0' : ''}
          onClick={toggleDropdownVisibility}
        >
          {isFilterActive() ? null : (
            <Button.Icon
              name="filter"
              alt="filter"
              color="white"
              stroke
              w={22}
              h={22}
            />
          )}
        </Button>
        <Button
          color="red"
          className={closeButtonClassName}
          onClick={onReset}
          type="reset"
        >
          <Button.Icon name="close" alt="close" color="white" stroke fill />
        </Button>
      </div>
      <div className={dropDownClassname}>
        <ActionBox className="shadow-default mt-1">
          <ActionBox.Content>
            <div className="py-2">{children}</div>
          </ActionBox.Content>
          <ActionBox.Footer>
            <div className="flex justify-between w-full space-x-2">
              <Button
                label="Cancelar"
                onClick={toggleDropdownVisibility}
                type="button"
              />
              <Button
                color="info"
                type="submit"
                label="Filtrar"
                onClick={handleClick}
              />
            </div>
          </ActionBox.Footer>
        </ActionBox>
      </div>
    </div>
  );
};

export default OrganizationFilter;
