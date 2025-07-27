import * as React from 'react';
import * as Yup from 'yup';
import { queryClient } from '../../../../queryClient';
import { Form, Formik } from 'formik';
import { Button, Input, Icon, Typography } from 'printer-ui';
import { useSnackbar } from '../../../../hooks';
import { noEmojiValidator } from '../../../../utils';
import { iconFieldType, transformFieldType } from '../../../utils';
import {
  BaseField,
  fieldTypeParams,
} from '../../../../services/printer-flow/types';
import { NewFieldProps, NewFieldFormValues, fieldActionType } from './types';
import FieldValueOptions from '../Field/FieldValueOptions';
import NewFieldTypeValuesSelect from '../Field/Select/';

const NewField = ({ onSubmit, setHidden }: NewFieldProps) => {
  const { showSnackbar } = useSnackbar();
  const [type, setType] = React.useState<fieldActionType>(
    'openFieldValueOption'
  );

  const [newFieldValueOption, setNewFieldValueOption] =
    React.useState<BaseField | null>(null);

  const fieldType: Array<{ name: string; value: fieldTypeParams }> = [
    { name: 'Texto curto', value: 'short_text' },
    { name: 'Texto longo', value: 'long_text' },
    { name: 'Anexo de arquivo', value: 'attachment' },
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

  return (
    <div className="mt-8">
      {newFieldValueOption === null ? (
        <Formik
          initialValues={
            {
              label: '',
              fieldType: '',
            } as NewFieldFormValues
          }
          onSubmit={(values, actions) => {
            onSubmit(values)
              .then((res) => {
                showSnackbar('Campo criado com sucesso', 'success');
                setNewFieldValueOption(res);
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
                      <NewFieldTypeValuesSelect
                        fieldType={fieldType}
                        name="fieldType"
                      />
                    </div>
                    {formik.touched.fieldType && formik.errors.fieldType ? (
                      <Typography variant="footnote2" color="error">
                        * {formik.errors.fieldType}
                      </Typography>
                    ) : null}
                  </div>
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
      ) : (
        newFieldValueOption !== null &&
        (newFieldValueOption.fieldType === 'select_field' ||
          newFieldValueOption.fieldType === 'checkbox') && (
          <div className="shadow-default w-full h-fit bg-white px-4 pt-4 pb-8 rounded-2xl border border-lightGray">
            <div
              className={
                type === 'openFieldValueOption'
                  ? 'w-full justify-end flex'
                  : 'hidden'
              }
            >
              <button
                type="button"
                onClick={() => queryClient.invalidateQueries(['fields'])}
              >
                <Icon name="close" alt="close" color="gray" fill stroke />
              </button>
            </div>
            <div className="space-y-8 pb-5">
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
                <div className="w-full">
                  <Typography
                    variant="footnote1"
                    family="roboto"
                    className="truncate w-full"
                  >
                    {newFieldValueOption.label}
                  </Typography>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Tipo do campo:
                  </Typography>
                </div>
                <div className="w-full flex items-center">
                  <Icon
                    name={iconFieldType(newFieldValueOption.fieldType)}
                    alt={iconFieldType(newFieldValueOption.fieldType)}
                    stroke={true}
                    fill={false}
                    w={26}
                    h={26}
                  />
                  <Typography
                    variant="footnote1"
                    family="roboto"
                    className="truncate w-full"
                  >
                    {transformFieldType(newFieldValueOption.fieldType)}
                  </Typography>
                </div>
              </div>
            </div>
            <FieldValueOptions
              type={type}
              setType={setType}
              fieldId={newFieldValueOption.id}
            />
          </div>
        )
      )}
    </div>
  );
};

export default NewField;
