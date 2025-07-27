import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Button, Input, Icon, Typography } from 'printer-ui';
import { useSnackbar } from '../../../../hooks';
import { fieldTypeParams } from '../../../../services/printer-flow/types/taskField';
import { NewTaskFieldProps, NewTaskFieldFormValues } from './types';
import SelectFieldType from '../SelectFieldType';
import { noEmojiValidator } from '../../../../utils';

const NewTaskField = ({ onSubmit, setHidden }: NewTaskFieldProps) => {
  const { showSnackbar } = useSnackbar();

  const fieldType: Array<{ name: string; value: fieldTypeParams }> = [
    { name: 'Texto curto', value: 'short_text' },
    { name: 'Texto longo', value: 'long_text' },
    { name: 'E-mail', value: 'email' },
    { name: 'CNPJ', value: 'cnpj' },
    { name: 'CPF', value: 'cpf' },
    { name: 'Telefone', value: 'phone' },
    { name: 'Data', value: 'date' },
    { name: 'Horário', value: 'time' },
    { name: 'Campo de número', value: 'numeric' },
    { name: 'Caixa de seleção', value: 'checkbox' },
    { name: 'Lista de seleção', value: 'select_field' },
  ];

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
    <Formik
      initialValues={
        {
          label: '',
          fieldType: '',
          options: [],
        } as NewTaskFieldFormValues
      }
      onSubmit={(values, actions) => {
        onSubmit(values)
          .then(() => {
            showSnackbar('Campo criado com sucesso', 'success');
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
        label: Yup.string()
          .required('Campo obrigatório')
          .test(
            'regex',
            'Não utilize emojis (desenhos ou pictogramas).',
            noEmojiValidator
          ),
        fieldType: Yup.string().required('Campo obrigatório'),
      })}
    >
      {(formik) => (
        <Form>
          <div className="shadow-default w-full h-fit bg-white px-4 pt-4 pb-8 rounded-2xl border border-lightGray">
            <div className="space-y-8">
              <div className="space-y-2 mt-2 w-full">
                <div>
                  <Typography
                    variant="footnote1"
                    family="robotoMedium"
                    className="truncate w-full"
                  >
                    Título do campo:
                  </Typography>
                </div>
                <div className="w-full md:block hidden">
                  <Input
                    size="md"
                    w="full"
                    name="label"
                    value={formik.values.label}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="w-full block md:hidden">
                  <Input
                    size="sm"
                    w="full"
                    name="label"
                    value={formik.values.label}
                    onChange={formik.handleChange}
                  />
                </div>
                {formik.touched.label && formik.errors.label ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.label}
                  </Typography>
                ) : null}
              </div>
              <div className="w-full space-y-2">
                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Tipo do campo:
                  </Typography>
                </div>
                <div className="w-full">
                  <SelectFieldType fieldType={fieldType} name="fieldType" />
                </div>
                {formik.touched.fieldType && formik.errors.fieldType ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.fieldType}
                  </Typography>
                ) : null}
              </div>
              {(formik.values.fieldType === 'checkbox' ||
                formik.values.fieldType === 'select_field') && (
                <div className="w-full space-y-2">
                  <div>
                    <Typography variant="footnote1" family="robotoMedium">
                      Opções do campo:
                    </Typography>
                  </div>
                  {inputs.map((input, index) => (
                    <div
                      key={index}
                      id={input.id}
                      className="w-full flex items-center space-x-1"
                    >
                      <div className="w-11/12 md:block hidden">
                        <Input
                          size="md"
                          w="full"
                          name={`options[${index}]`}
                          value={formik.values.options[index]}
                          onChange={formik.handleChange}
                        />
                      </div>
                      <div className="w-11/12 block md:hidden">
                        <Input
                          size="sm"
                          w="full"
                          name={`options[${index}]`}
                          value={formik.values.options[index]}
                          onChange={formik.handleChange}
                        />
                      </div>
                      <button
                        type="button"
                        disabled={false}
                        onClick={removeInputs}
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
                    </div>
                  ))}
                  <Button
                    type="button"
                    color="info"
                    label="Opção"
                    onClick={addInputs}
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
                </div>
              )}
              <div className="flex space-x-2 justify-between">
                <Button
                  type="button"
                  label="Cancelar"
                  color="error"
                  onClick={() => {
                    setHidden('hidden');
                  }}
                />
                <Button
                  type="submit"
                  label="Adicionar"
                  color="info"
                  className="truncate"
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewTaskField;
