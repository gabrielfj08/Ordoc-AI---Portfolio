import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Typography, Input, Icon } from 'printer-ui';
import { queryClient } from '../../../../../../queryClient';
import { noEmojiValidator } from '../../../../../../utils';
import { useAuth, useSnackbar } from '../../../../../../hooks';
import { FieldValueOptionService } from '../../../../../../services/printer-flow';
import { ValueOptionProps, ValueOptionFormValues } from './types';

const ValueOption = ({
  onSubmit,
  type,
  fieldValueOption,
  total,
}: ValueOptionProps) => {
  const { subdomain, token } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [editValueOption, setEditValueOption] = React.useState<boolean>(false);

  const EditValueOption = () => {
    if (editValueOption === true)
      return (
        <Formik
          initialValues={
            {
              value: fieldValueOption.value,
            } as ValueOptionFormValues
          }
          onSubmit={(values, actions) => {
            onSubmit(values)
              .then(() => {
                showSnackbar('Alterações salvas com sucesso', 'success');
                setEditValueOption(false);
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
              <div className="flex items-center space-x-1">
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
                <button
                  type="button"
                  disabled={false}
                  onClick={() => setEditValueOption(false)}
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
              {formik.touched.value && formik.errors.value ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.value}
                </Typography>
              ) : null}
            </Form>
          )}
        </Formik>
      );
    return null;
  };

  const valueOption: any = {
    show: (
      <div className="w-full">
        <Typography
          variant="footnote1"
          family="roboto"
          className="truncate w-full"
        >
          {fieldValueOption.value}
        </Typography>
      </div>
    ),
    edit: (
      <div className="w-full">
        <Typography
          variant="footnote1"
          family="roboto"
          className="truncate w-full"
        >
          {fieldValueOption.value}
        </Typography>
      </div>
    ),
    openFieldValueOption: (
      <div className="w-full">
        {editValueOption === false ? (
          <div className="flex items-center space-x-1">
            <Typography
              variant="footnote1"
              family="roboto"
              className="truncate w-full"
            >
              {fieldValueOption.value}
            </Typography>
            <button
              type="button"
              disabled={false}
              onClick={() => setEditValueOption(true)}
            >
              <Icon
                name="write"
                alt="editar"
                color="info"
                w={25}
                h={25}
                fill
                stroke
              />
            </button>
            <button
              type="button"
              disabled={total < 3 ? true : false}
              onClick={() =>
                FieldValueOptionService.deleteFieldValueOption(
                  token,
                  subdomain,
                  fieldValueOption.fieldId,
                  fieldValueOption.id
                )
                  .then(() => {
                    showSnackbar(
                      `Opção do campo removido com sucesso.`,
                      'success'
                    );
                    queryClient.invalidateQueries([
                      'fieldValueOptions',
                      subdomain,
                      token,
                      fieldValueOption.fieldId,
                      {},
                    ]);
                  })
                  .catch((error) => {
                    showSnackbar(error.response.data.message, 'error');
                  })
              }
            >
              <Icon
                name="trashV2"
                alt="excluir"
                color={total < 3 ? 'lightGray' : 'error'}
                w={25}
                h={25}
                fill
                stroke
              />
            </button>
          </div>
        ) : (
          <EditValueOption />
        )}
      </div>
    ),
  };
  return <div>{valueOption[type]}</div>;
};

export default ValueOption;
