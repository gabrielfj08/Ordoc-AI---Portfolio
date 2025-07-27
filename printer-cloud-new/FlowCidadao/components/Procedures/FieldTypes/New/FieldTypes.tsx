import * as React from 'react';
import {
  CheckboxV3 as Checkbox,
  FileInput,
  InputV3 as Input,
  RadioV3 as Radio,
  SelectV3 as Select,
  TextAreaV3 as TextArea,
  TypographyV3 as Typography,
} from 'printer-ui';
import { NewProcedureFieldTypesProps } from './types';
import { FieldTypesMapping as FieldType } from '../../../../../PrinterFlow/constants/FieldTypes';
import ShowDocumentTemplate from './ShowDocumentTemplate';
import NewProcedureAttachmentList from './AttachmentList';
import { Field } from 'formik';
import UploadStatusIcon from '../../../UploadStatusIcon';

const NewProcedureFieldTypes = ({
  formik,
  type,
  color,
  fieldName,
  label,
  options,
  value,
  procedure,
  index,
  disabled,
  setDisableSubmitButton,
}: NewProcedureFieldTypesProps) => {
  const [files, setFiles] = React.useState<FileList>();
  const [attachmentLoading, setAttachmentLoading] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    setDisableSubmitButton(attachmentLoading);
  }, [attachmentLoading]);

  const transformOptions: any = (options: Array<string> | undefined) => {
    if (!options) return null;

    return options.map((option) => {
      return { label: option, value: option };
    });
  };

  const setFormErrors = (formik, index) => {
    return formik?.touched?.payload && formik?.errors?.payload ? (
      formik.errors.payload[index]?.value ? (
        <Typography variant="label" family="jakarta" color="error">
          * {formik.errors.payload[index].value}
        </Typography>
      ) : null
    ) : null;
  };

  switch (type) {
    case FieldType.cpf:
      return (
        <div>
          <Input
            label={label}
            borderColor={color}
            focusBorderColor={color}
            type="text"
            name={fieldName}
            value={formik.values.fieldName || value}
            onChange={formik ? formik.handleChange : () => {}}
            maxLength={11}
            disabled={disabled}
            w="full"
          />
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.cnpj:
      return (
        <div>
          <Input
            label={label}
            borderColor={color}
            focusBorderColor={color}
            type="text"
            name={fieldName}
            value={formik.values.fieldName || value}
            onChange={formik ? formik.handleChange : () => {}}
            maxLength={14}
            disabled={disabled}
            w="full"
          />
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.radio:
      return (
        <div className="relative">
          <Typography variant="label" family="jakartaBold" color={color}>
            {label}
          </Typography>
          <div
            className={`sm:flex bg-white p-4 space-y-4 sm:space-y-0 sm:gap-4 sm:justify-around sm:flex-wrap min-h-[56px] border ${
              disabled ? 'border-lightGray bg-lightGray' : `border-${color}`
            } rounded-lg`}
          >
            {options &&
              options.map((option) => (
                <label
                  className="flex items-center gap-3"
                  key={option}
                  htmlFor={fieldName + option}
                >
                  <Field
                    as={Radio}
                    color={color}
                    id={fieldName + option}
                    type="radio"
                    name={fieldName}
                    value={option}
                    disabled={disabled}
                  />
                  <Typography
                    variant="bodyMd"
                    family="jakarta"
                    color={disabled ? 'gray' : `${color}`}
                  >
                    {option}
                  </Typography>
                </label>
              ))}
          </div>
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.checkbox:
      return (
        <div className="relative">
          <Typography variant="label" family="jakartaBold" color={color}>
            {label}
          </Typography>
          <div
            className={`sm:flex p-4 space-y-4 sm:space-y-0 sm:gap-4 sm:justify-around sm:flex-wrap bg-white min-h-[56px] border ${
              disabled ? 'border-lightGray' : `border-${color}`
            } rounded-lg`}
          >
            {options &&
              options.map((option) => (
                <label
                  className="flex gap-2 items-center"
                  key={option}
                  htmlFor={fieldName + option}
                >
                  <Field
                    as={Checkbox}
                    color={color}
                    id={fieldName + option}
                    type="checkbox"
                    name={fieldName}
                    value={option}
                    disabled={disabled}
                  />
                  <Typography
                    variant="bodyMd"
                    family="jakarta"
                    color={disabled ? 'gray' : `${color}`}
                  >
                    {option}
                  </Typography>
                </label>
              ))}
          </div>
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.email:
      return (
        <div>
          <Input
            label={label}
            borderColor={color}
            focusBorderColor={color}
            type="email"
            name={fieldName}
            value={formik.values.fieldName || value}
            onChange={formik ? formik.handleChange : () => {}}
            disabled={disabled}
            w="full"
          />
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.phone:
      return (
        <div>
          <Input
            label={label}
            borderColor={color}
            focusBorderColor={color}
            type="phone"
            name={fieldName}
            value={formik.values.fieldName || value}
            onChange={formik ? formik.handleChange : () => {}}
            maxLength={11}
            disabled={disabled}
            w="full"
          />
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.attachment:
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <FileInput
              multiple
              label={label}
              id={fieldName}
              styleColor={color}
              name={fieldName}
              value={formik.values.fieldName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                formik && !disabled ? formik.handleChange : () => {},
                  setFiles(e.target.files as FileList);
              }}
              disabled={disabled || attachmentLoading}
              accept=".pdf, .png, .jpeg, .docx, .jpg, .zip, .winrar, .xls, .ods, .rar, .xlsx, .odp, .ppt, .pptx, .odt, .doc, .txt"
            />
            {attachmentLoading && (
              <UploadStatusIcon status="running" color={color} />
            )}
          </div>
          {!disabled && (
            <ShowDocumentTemplate
              procedureTemplateId={procedure.procedureTemplateId}
              fieldName={label}
              color={color}
            />
          )}
          <Typography
            variant="label"
            className={`${disabled && 'hidden'} italic`}
            color="gray"
          >
            Extensões válidas: .pdf, .png, .jpeg, .docx, .jpg, .zip, .winrar,
            .xls, .ods, .rar, .xlsx, .odp, .ppt, .pptx, .odt, .doc, .txt
          </Typography>
          <div>
            <div className="w-full min-h-[10px]">
              <NewProcedureAttachmentList
                key={fieldName}
                disabled={disabled}
                color={color}
                fileList={files as FileList}
                procedure={procedure}
                fieldName={fieldName}
                formik={formik}
                value={value}
                setAttachmentLoading={setAttachmentLoading}
              />
            </div>
            {setFormErrors(formik, index)}
          </div>
        </div>
      );

    case FieldType.date:
      return (
        <div>
          <Input
            label={label}
            borderColor={color}
            focusBorderColor={color}
            textColor={color}
            type="date"
            name={fieldName}
            value={formik.values.fieldType || value}
            onChange={formik ? formik.handleChange : () => {}}
            disabled={disabled}
            w="full"
          />
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.time:
      return (
        <div>
          <Input
            label={label}
            borderColor={color}
            focusBorderColor={color}
            type="time"
            textColor={color}
            name={fieldName}
            value={formik.values.fieldName || value}
            onChange={formik ? formik.handleChange : () => {}}
            disabled={disabled}
            w="full"
          />
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.select:
      return (
        <div>
          <Select
            w="full"
            color={color}
            label={label}
            name={fieldName}
            onChange={
              formik
                ? (selectedOption) =>
                    formik.setFieldValue(fieldName, selectedOption.value)
                : () => {}
            }
            isDisabled={disabled}
            options={transformOptions(options)}
            value={formik.values.fieldName || { label: value, value: value }}
          />
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.numeric:
      return (
        <div>
          <Input
            label={label}
            borderColor={color}
            focusBorderColor={color}
            type="number"
            name={fieldName}
            value={formik.values.fieldName || value}
            onChange={formik ? formik.handleChange : () => {}}
            disabled={disabled}
            w="full"
          />
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.shortText:
      return (
        <div>
          <Input
            label={label}
            borderColor={color}
            focusBorderColor={color}
            type="text"
            name={fieldName}
            value={formik.values.fieldName || value}
            onChange={formik ? formik.handleChange : () => {}}
            disabled={disabled}
            w="full"
          />
          {setFormErrors(formik, index)}
        </div>
      );

    case FieldType.longText:
      return (
        <div>
          <TextArea
            label={label}
            color={color}
            name={fieldName}
            value={formik.values.fieldName || value}
            onChange={formik ? formik.handleChange : () => {}}
            disabled={disabled}
            w="full"
          />
          {setFormErrors(formik, index)}
        </div>
      );
    default:
      return null;
  }
};

export default NewProcedureFieldTypes;
