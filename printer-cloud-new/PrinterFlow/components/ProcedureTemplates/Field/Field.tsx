import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Button, Input, Typography, Icon } from 'printer-ui';
import { useSnackbar } from '../../../../hooks';
import { noEmojiValidator } from '../../../../utils';
import { iconFieldType, transformFieldType } from '../../../utils';
import { fieldTypeParams } from '../../../../services/printer-flow/types';
import { FieldProps, FieldFormValues } from './types';
import FieldsMenuButton from './MenuButton';
import FieldValueOptions from './FieldValueOptions';
import FieldDocumentTemplates from './FieldDocumentTemplates';
import NewFieldTypeValuesSelect from './Select';

const ProcedureTemplateField = ({
  onSubmit,
  field,
  procedureTemplate,
  type,
  setType,
}: FieldProps) => {
  const { showSnackbar } = useSnackbar();

  const fieldType: Array<{
    name: string;
    value: fieldTypeParams;
  }> = [
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

  const ValueOptions = () => {
    if (field.fieldType === 'select_field' || field.fieldType === 'checkbox')
      return (
        <FieldValueOptions type={type} setType={setType} fieldId={field.id} />
      );
    return null;
  };

  const DocumentTemplates = () => {
    if (field.fieldType === 'attachment')
      return (
        <FieldDocumentTemplates
          type={type}
          setType={setType}
          fieldDocumentTemplate={field.fieldDocumentTemplate}
          fieldId={field.id}
          procedureTemplateId={field.procedureTemplateId}
        />
      );
    return null;
  };

  const fieldMapping: any = {
    show: (
      <div className="shadow-default w-full h-fit bg-white px-4 pt-4 pb-8 rounded-2xl border border-lightGray">
        <div
          className={
            type === 'edit' || procedureTemplate.status === 'inactive'
              ? 'hidden'
              : 'w-full justify-end flex'
          }
        >
          <FieldsMenuButton field={field} setType={setType} />
        </div>
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
            <div className="w-full">
              <Typography
                variant="footnote1"
                family="roboto"
                className="truncate w-full"
              >
                {field.label}
              </Typography>
            </div>
          </div>
          <div className="w-full space-y-2">
            <div>
              <Typography variant="footnote1" family="robotoMedium">
                Tipo do campo:
              </Typography>
            </div>
            <div className="w-full flex items-center space-x-1">
              <Icon
                name={iconFieldType(field.fieldType)}
                alt={iconFieldType(field.fieldType)}
                stroke={field.fieldType === 'cnpj' ? false : true}
                fill={field.fieldType === 'cnpj' ? true : false}
                w={26}
                h={26}
              />
              <Typography
                variant="footnote1"
                family="roboto"
                className="truncate w-full"
              >
                {transformFieldType(field.fieldType)}
              </Typography>
            </div>
          </div>
          <ValueOptions />
          <DocumentTemplates />
        </div>
      </div>
    ),
    openFieldValueOption: (
      <div className="shadow-default w-full h-fit bg-white px-4 pt-4 pb-8 rounded-2xl border border-lightGray">
        <div
          className={
            type === 'edit' ||
            type === 'openFieldValueOption' ||
            type === 'openFieldDocumentTemplate'
              ? 'hidden'
              : 'w-full justify-end flex'
          }
        >
          <FieldsMenuButton field={field} setType={setType} />
        </div>
        <div
          className={
            type === 'openFieldValueOption'
              ? 'w-full justify-end flex'
              : 'hidden'
          }
        >
          <button type="button" onClick={() => setType('show')}>
            <Icon name="close" alt="close" color="gray" fill stroke />
          </button>
        </div>
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
            <div className="w-full">
              <Typography
                variant="footnote1"
                family="roboto"
                className="truncate w-full"
              >
                {field.label}
              </Typography>
            </div>
          </div>
          <div className="w-full space-y-2">
            <div>
              <Typography variant="footnote1" family="robotoMedium">
                Tipo do campo:
              </Typography>
            </div>
            <div className="w-full flex items-center space-x-1">
              <Icon
                name={iconFieldType(field.fieldType)}
                alt={iconFieldType(field.fieldType)}
                stroke={field.fieldType === 'cnpj' ? false : true}
                fill={field.fieldType === 'cnpj' ? true : false}
                w={26}
                h={26}
              />
              <Typography
                variant="footnote1"
                family="roboto"
                className="truncate w-full"
              >
                {transformFieldType(field.fieldType)}
              </Typography>
            </div>
          </div>
          <ValueOptions />
        </div>
      </div>
    ),
    openFieldDocumentTemplate: (
      <div className="shadow-default w-full h-fit bg-white px-4 pt-4 pb-8 rounded-2xl border border-lightGray">
        <div
          className={
            type === 'edit' ||
            type === 'openFieldValueOption' ||
            type === 'openFieldDocumentTemplate'
              ? 'hidden'
              : 'w-full justify-end flex'
          }
        >
          <FieldsMenuButton field={field} setType={setType} />
        </div>
        <div
          className={
            type === 'openFieldDocumentTemplate'
              ? 'w-full justify-end flex'
              : 'hidden'
          }
        >
          <button type="button" onClick={() => setType('show')}>
            <Icon name="close" alt="close" color="gray" fill stroke />
          </button>
        </div>
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
            <div className="w-full">
              <Typography
                variant="footnote1"
                family="roboto"
                className="truncate w-full"
              >
                {field.label}
              </Typography>
            </div>
          </div>
          <div className="w-full space-y-2">
            <div>
              <Typography variant="footnote1" family="robotoMedium">
                Tipo do campo:
              </Typography>
            </div>
            <div className="w-full flex items-center space-x-1">
              <Icon
                name={iconFieldType(field.fieldType)}
                alt={iconFieldType(field.fieldType)}
                stroke={field.fieldType === 'cnpj' ? false : true}
                fill={field.fieldType === 'cnpj' ? true : false}
                w={26}
                h={26}
              />
              <Typography
                variant="footnote1"
                family="roboto"
                className="truncate w-full"
              >
                {transformFieldType(field.fieldType)}
              </Typography>
            </div>
          </div>
          <DocumentTemplates />
        </div>
      </div>
    ),
    edit: (
      <Formik
        initialValues={
          {
            label: field.label,
            fieldType: field.fieldType,
          } as FieldFormValues
        }
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              showSnackbar('Alterações salvas com sucesso', 'success');
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
        })}
      >
        {(formik) => (
          <Form>
            <div className="shadow-default w-full h-fit bg-white px-4 pt-4 pb-8 rounded-2xl border border-lightGray">
              <div
                className={
                  type === 'edit' ? 'hidden' : 'w-full justify-end flex'
                }
              >
                <FieldsMenuButton field={field} setType={setType} />
              </div>
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
                </div>
                <ValueOptions />
                <DocumentTemplates />
                <div className="flex space-x-2 justify-between">
                  <Button
                    type="button"
                    label="Cancelar"
                    color="error"
                    onClick={() => {
                      setType('show');
                    }}
                  />
                  <Button
                    type="submit"
                    label="Salvar alterações"
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
    ),
  };

  return <div className="mt-8">{fieldMapping[type]}</div>;
};

export default ProcedureTemplateField;
