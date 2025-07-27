import * as React from 'react';
import router from 'next/router';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { Icon } from 'printer-ui';

const SearchInput = () => {
  const [focus, setFocus] = React.useState<boolean>(false);
  const formik = useFormikContext();

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleSubmit = (values) => {
    if (values.q) {
      router.push(
        `/printer-air/search?q="${values.q}"&start=0&rows=10&defType=dismax`
      );
    } else {
      router.push(`/printer-air/search?q=*:*&start=0&rows=10`);
    }
  };

  return (
    <Form>
      <div
        className={`${
          focus && 'outline outline-2 outline-lightGray outline-offset-2'
        } rounded-lg flex`}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <div className="rounded-l-lg h-10 w-fit bg-white flex items-center pl-5 pr-2">
          <Icon name="search" alt="search" stroke w={28} h={28} />
        </div>
        <Field
          id="q"
          name="q"
          placeholder="Buscar"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSubmit(formik.values);
            }
          }}
          className="h-10 w-full rounded-r-lg bg-white font-roboto-400 placeholder:font-roboto-400 focus:outline-none"
        />
      </div>
    </Form>
  );
};

const SearchInputContext = () => {
  const initialSearchValue = router.query.q
    ? String(router.query.q).split('"').join('')
    : '';

  const sanitizedInitialValue = initialSearchValue
    .replace(/q=[^&]+(&|$)/, '')
    .replace(/\(([^)]+)\)/g, ' ')
    .replace(
      /(OR|AND) (content|original_filename|description|location):[^&]+/g,
      ' '
    )
    .replace(/\*:\*/g, '')
    .trim();

  const initialValue = sanitizedInitialValue || '';

  return (
    <Formik initialValues={{ q: initialValue }} onSubmit={() => {}}>
      <SearchInput />
    </Formik>
  );
};

export default SearchInputContext;
