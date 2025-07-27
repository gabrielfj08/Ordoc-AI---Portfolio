import * as React from 'react';
import { ActionBox, Button } from 'printer-ui';
import { FilterButtonProps } from './types';

const UserFilter = ({
  children,
  organization_id,
  status,
  onReset,
  onClick,
}: FilterButtonProps) => {
  const [isDropdownVisible, setDropdownVisibility] = React.useState(false);
  const closeButtonVisibility = status || organization_id ? null : 'hidden';
  const closeButtonClassName = `${closeButtonVisibility} px-0 rounded-l-none`;
  const dropDownClassname = isDropdownVisible
    ? 'absolute z-20 -ml-44'
    : 'hidden';

  const toggleDropdownVisibility = () => {
    setDropdownVisibility((current) => !current);
  };

  const handleClick = () => {
    onClick();
    toggleDropdownVisibility();
  };

  const isFilterActive = () => {
    if (status || organization_id) {
      return true;
    }
  };

  return (
    <div className="w-fit h-fit">
      <div className="flex justify-end">
        <Button
          color={isFilterActive() ? 'red' : 'info'}
          label={isFilterActive() ? 'Limpar filtro' : 'Filtrar'}
          type="button"
          className={
            isFilterActive() ? 'rounded-r-none pr-0 px-8 truncate' : 'px-8'
          }
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
          <Button.Icon
            name="close"
            alt="close"
            color="white"
            w={24}
            h={24}
            stroke
            fill
          />
        </Button>
      </div>
      <div className={dropDownClassname}>
        <ActionBox className="shadow-default">
          <ActionBox.Content>{children}</ActionBox.Content>
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

export default UserFilter;
