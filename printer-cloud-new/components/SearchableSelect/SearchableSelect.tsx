import * as React from 'react';
import Select, {
  components,
  OptionProps,
  CSSObjectWithLabel,
} from 'react-select';
import { useField } from 'formik';
import { SearchableSelectProps, widthMapping } from './types';

const SearchableSelect = ({
  items,
  itemHandleClick,
  isDisabled,
  isLinkable,
  isSearchable,
  isClearable,
  linkLabel,
  name,
  noOptionsMessage,
  placeholder,
  selectedItem,
  setSelectedItem,
  w,
}: SearchableSelectProps) => {
  const width = widthMapping[w || 128] || '512px';

  const Option = (props: OptionProps) => {
    return (
      <components.Option {...props}>
        <div className="flex flex-row truncate justify-between">
          <div className="font-roboto-400 truncate pr-10 text-[15px]">
            {props.children}
          </div>
          {isLinkable ? (
            <button
              className="underline underline-info underline-offset-1 text-info font-roboto-400 text-[15px]"
              onClick={itemHandleClick}
            >
              {linkLabel}
            </button>
          ) : null}
        </div>
      </components.Option>
    );
  };

  const multipleSelectStyle = {
    multiValue: (base: CSSObjectWithLabel) => ({
      ...base,
      borderRadius: '12px',
      backgroundColor: '#F2F1F1',
      fontFamily: 'Roboto Regular',
      fontSize: '17px',
      alignItems: 'center',
      padding: '4px',
    }),
    multiValueRemove: (base: CSSObjectWithLabel) => ({
      ...base,
      ':hover': {
        backgroundColor: '#C2C2C2',
      },
      backgroundColor: '#D9D9D9',
      borderRadius: '20px',
      padding: 'none',
      height: '22px',
      width: '22px',
      marginLeft: '4px',
      marginRight: '4px',
    }),
    control: (css: CSSObjectWithLabel) => ({
      ...css,
      borderRadius: '8px',
      maxWidth: `${width}`,
      minHeight: '48px',
    }),
    indicatorSeparator: (base: CSSObjectWithLabel) => ({
      ...base,
      display: 'none',
    }),
    placeholder: (base: CSSObjectWithLabel) => ({
      ...base,
      fontFamily: 'Roboto Regular',
    }),
    menu: (base: CSSObjectWithLabel) => ({
      ...base,
      maxWidth: `${width}`,
    }),
    noOptionsMessage: (base: CSSObjectWithLabel) => ({
      ...base,
      fontFamily: 'Roboto Regular',
      fontSize: '15px',
    }),
  };

  return (
    <Select
      name={name}
      placeholder={placeholder || ''}
      className="basic-single"
      classNamePrefix="select"
      components={{ Option }}
      defaultValue={items}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      styles={multipleSelectStyle}
      options={items}
      value={selectedItem}
      onChange={setSelectedItem}
      noOptionsMessage={() => noOptionsMessage || 'Nenhuma opção encontrada'}
    />
  );
};

export default SearchableSelect;
