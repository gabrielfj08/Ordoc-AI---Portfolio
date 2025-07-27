import * as React from 'react';
import { Field } from 'formik';
import { Button, Typography } from 'printer-ui';
import { FieldTypesProps } from './types';
import { useModal } from '../../../../hooks';
import { FieldTypesMapping as FieldType } from '../../../constants/FieldTypes';
import AddAttachmentsModal from './AttachmentField';
import AttachmentUploadList from './AttachmentField/AttachmentUploadList';
import ShowDocumentTemplate from './ShowDocumentTemplate';

const FieldTypes = ({
  formik,
  type,
  fieldName,
  label,
  options,
  value,
  procedure,
  index,
  disabled,
}: FieldTypesProps) => {
  const { openModal } = useModal();
  const [attachmentUploadListVisibility, setAttachmentUploadListVisibility] =
    React.useState<boolean>(false);
  const [files, setFiles] = React.useState<FileList>();

  const divClassName = `w-full border h-12 rounded flex items-center px-4 focus-within:border-2 focus-within:border-info ${
    disabled ? 'bg-lighterGray border-lightGray' : 'bg-white'
  }`;

  switch (type) {
    case FieldType.cpf:
      return (
        <>
          <div className={divClassName}>
            <input
              type="text"
              name={fieldName}
              value={value}
              onChange={formik ? formik.handleChange : () => {}}
              className="w-full font-roboto-400 focus:outline-none  disabled:bg-lighterGray"
              maxLength={11}
              disabled={disabled}
            />
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.cnpj:
      return (
        <>
          <div className={divClassName}>
            <input
              type="text"
              name={fieldName}
              value={value}
              onChange={formik ? formik.handleChange : () => {}}
              className="w-full font-roboto-400 focus:outline-none  disabled:bg-lighterGray"
              maxLength={14}
              disabled={disabled}
            />
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.radio:
      return (
        <>
          {options &&
            options.map((option) => (
              <div className="flex gap-2" key={option}>
                <Field
                  type="radio"
                  name={fieldName}
                  value={option}
                  disabled={disabled}
                />
                <Typography
                  variant="footnote1"
                  color={disabled ? 'gray' : 'black'}
                >
                  {option}
                </Typography>
              </div>
            ))}
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.checkbox:
      return (
        <>
          {options &&
            options.map((option) => (
              <div className="flex gap-2" key={option}>
                <Field
                  id={option}
                  type="checkbox"
                  name={fieldName}
                  value={option}
                  disabled={disabled}
                />
                <label htmlFor={option} className="cursor-pointer">
                  <Typography
                    variant="footnote1"
                    color={disabled ? 'gray' : 'black'}
                  >
                    {option}
                  </Typography>
                </label>
              </div>
            ))}
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.email:
      return (
        <>
          <div className={divClassName}>
            <input
              type="email"
              name={fieldName}
              value={value}
              onChange={formik ? formik.handleChange : () => {}}
              className="w-full font-roboto-400 focus:outline-none  disabled:bg-lighterGray"
              disabled={disabled}
            />
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.phone:
      return (
        <>
          <div className={divClassName}>
            <input
              type="phone"
              name={fieldName}
              value={value}
              onChange={formik ? formik.handleChange : () => {}}
              className="w-full font-roboto-400 focus:outline-none  disabled:bg-lighterGray"
              maxLength={11}
              disabled={disabled}
            />
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.attachment:
      return (
        <>
          <div className="space-y-2">
            <Button
              label="Anexar arquivo(s)"
              color="info"
              outlined={disabled ? false : true}
              type="button"
              disabled={disabled}
              onClick={() =>
                openModal(
                  <AddAttachmentsModal
                    setUploadVisibility={setAttachmentUploadListVisibility}
                    setFileList={setFiles}
                    name={fieldName}
                    formik={formik}
                  />
                )
              }
            />
            <div className={attachmentUploadListVisibility ? 'flex' : 'hidden'}>
              {files && (
                <AttachmentUploadList
                  fileList={files}
                  procedure={procedure}
                  fieldName={fieldName}
                  formik={formik}
                />
              )}
            </div>
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
          {procedure.id ? (
            <ShowDocumentTemplate
              procedureTemplateId={procedure.procedureTemplateId}
              fieldName={label}
            />
          ) : null}
        </>
      );

    case FieldType.date:
      return (
        <>
          <div
            className={`w-full border h-12 rounded flex items-center px-4 focus-within:border-2 focus-within:border-info ${
              disabled ? 'bg-lighterGray border-lightGray' : 'bg-white'
            }`}
          >
            <input
              type="date"
              name={fieldName}
              value={value}
              onChange={formik ? formik.handleChange : () => {}}
              className="w-full font-roboto-400 focus:outline-none disabled:text-gray/50 disabled:bg-lighterGray"
              disabled={disabled}
            />
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.time:
      return (
        <>
          <div
            className={`w-full border h-12 rounded flex items-center px-4 focus-within:border-2 focus-within:border-info ${
              disabled ? 'bg-lighterGray border-lightGray' : 'bg-white'
            }`}
          >
            <input
              type="time"
              name={fieldName}
              value={value}
              onChange={formik ? formik.handleChange : () => {}}
              className="w-full font-roboto-400 focus:outline-none disabled:text-gray/50 disabled:bg-lighterGray"
              disabled={disabled}
            />
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );

    case FieldType.select:
      return (
        <>
          <div className={divClassName}>
            <Field
              as="select"
              className="w-full font-roboto-400 h-full focus:outline-none bg-white disabled:bg-lighterGray disabled:text-gray"
              name={fieldName}
              onChange={formik ? formik.handleChange : () => {}}
              disabled={disabled}
            >
              <option value={''}>Selecione uma opção</option>
              {options &&
                options.map((option) => {
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
            </Field>
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.numeric:
      return (
        <>
          <div className={divClassName}>
            <input
              type="number"
              name={fieldName}
              value={value}
              onChange={formik ? formik.handleChange : () => {}}
              className={`w-full font-roboto-400 focus:outline-none ${
                disabled ? 'bg-lighterGray' : 'bg-white'
              }`}
              disabled={disabled}
            />
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.shortText:
      return (
        <>
          <div
            className={`w-full border h-12 rounded flex items-center px-4 focus-within:border-2 focus-within:border-info ${
              disabled
                ? 'bg-lighterGray placeholder:text-lg border-lightGray'
                : 'bg-white'
            }`}
          >
            <Field
              name={fieldName}
              type="text"
              className="w-full h-full font-roboto-400 focus:outline-none disabled:bg-lighterGray"
              value={value}
              disabled={disabled}
            />
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.longText:
      return (
        <>
          <div
            className={`w-full border h-24 rounded flex items-center px-4 focus-within:border-2 focus-within:border-info  ${
              disabled ? 'bg-lighterGray border-lightGray' : 'bg-white'
            }`}
          >
            <Field
              as="textarea"
              className="w-full font-roboto-400 focus:outline-none resize-none  disabled:bg-lighterGray"
              name={fieldName}
              value={value}
              disabled={disabled}
            />
          </div>
          {formik?.touched?.payload && formik?.errors?.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    default:
      return null;
  }
};

export default FieldTypes;
