import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Button, Input, Icon, Typography } from 'printer-ui';
import { noEmojiValidator } from '../../../../../../utils';
import { useSnackbar } from '../../../../../../hooks';
import { NewValueOptionProps, NewValueOptionFormValues } from './types';

const NewValueOption = ({ onSubmit }: NewValueOptionProps) => {
  const { showSnackbar } = useSnackbar();

  const [inputs, setInputs] = React.useState<Array<{ id: string }>>([]);

  const addInputs = () => {
    setInputs([...inputs, { id: `option-${inputs.length + 1}` }]);
  };

  const removeInputs = (index: any) => {
    const rows = [...inputs];
    rows.splice(index, 1);
    setInputs(rows);
  };

  return (
    <>
      {inputs.map((input, index) => (
        <div key={index} id={input.id} className="w-full">
          <Formik
            initialValues={
              {
                value: '',
              } as NewValueOptionFormValues
            }
            onSubmit={(
              values: NewValueOptionFormValues,
              actions: { setSubmitting: (arg0: boolean) => void }
            ) => {
              onSubmit(values)
                .then(() => {
                  showSnackbar('Opção do campo criado com sucesso', 'success');
                  removeInputs(index);
                })
                .catch((error) => {
                  showSnackbar(error.response.data.message, 'error');
                })
                .finally(() => {
                  actions.setSubmitting(false);
                });
            }}
            enableReinitialize
            validationSchema={Yup.object().shape({
              value: Yup.string()
                .required('Campo obrigatório')
                .test(
                  'regex',
                  'Não utilize emojis (desenhos ou pictogramas).',
                  noEmojiValidator
                ),
            })}
          >
            {(formik) => (
              <Form>
                <div className="w-full flex items-center space-x-1">
                  <div className="w-11/12 md:block hidden">
                    <Input
                      size="md"
                      w="full"
                      name="value"
                      value={formik.values.value}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="w-11/12 block md:hidden">
                    <Input
                      size="sm"
                      w="full"
                      name="value"
                      value={formik.values.value}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-info rounded-md"
                    disabled={formik.isSubmitting}
                  >
                    <Icon
                      name="check"
                      alt="check"
                      color="white"
                      w={25}
                      h={25}
                      fill
                      stroke
                    />
                  </button>
                  <button type="button" disabled={false} onClick={removeInputs}>
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
                </div>
                {formik.touched.value && formik.errors.value ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.value}
                  </Typography>
                ) : null}
              </Form>
            )}
          </Formik>
        </div>
      ))}
      <Button type="button" color="info" label="Opção" onClick={addInputs}>
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
    </>
  );
};

export default NewValueOption;
