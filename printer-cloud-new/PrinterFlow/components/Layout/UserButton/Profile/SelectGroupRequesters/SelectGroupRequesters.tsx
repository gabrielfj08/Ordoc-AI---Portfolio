import * as React from 'react';
import { Item, Select } from 'printer-ui';
import { IndexGroupRequester } from '../../../../../../services/printer-flow/types';
import { SelectGroupProps } from './types';

const SelectGroup = ({
  groupRequesters,
  currentGroup,
  setCurrentGroup,
}: SelectGroupProps) => {
  const handleClick = (item: Item) => {
    const groupRequester = groupRequesters.filter(
      (groupRequester) => Number(item.id) === groupRequester.id
    )[0];

    setCurrentGroup(groupRequester);
  };

  return (
    <Select
      w={56}
      items={groupRequesters.map((item: IndexGroupRequester) => {
        return {
          id: `${item.id}`,
          value: `${item.name}`,
        };
      })}
      selectedItem={{
        id: String(currentGroup.id),
        value: currentGroup.name,
      }}
      setSelectedItem={handleClick}
    />
  );
};

export default SelectGroup;
