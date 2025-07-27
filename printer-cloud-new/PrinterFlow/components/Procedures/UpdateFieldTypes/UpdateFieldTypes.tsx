import * as React from 'react';
import { Field } from 'formik';
import { Button, Typography } from 'printer-ui';
import { FieldTypesProps } from './types';
import { useModal } from '../../../../hooks';
import { FieldTypesMapping as FieldType } from '../../../constants/FieldTypes';
import AddAttachmentsModal from './AttachmentField';
import AttachmentUploadList from './AttachmentField/AttachmentUploadList';
import ShowDocumentTemplate from '../FieldTypes/ShowDocumentTemplate';

const UpdateFieldTypes = ({
  formik,
  type,
  fieldName,
  label,
  options,
  value,
  procedure,
  index,
}: FieldTypesProps) => {
  const { openModal } = useModal();

  const [files, setFiles] = React.useState<FileList>();

  const divClassName =
    'w-full border h-12 rounded flex items-center px-4 focus-within:border-2 focus-within:border-info';

  switch (type) {
    case FieldType.cpf:
      return (
        <>
          <div className={divClassName}>
            <input
              type="text"
              name={fieldName}
              value={value}
              onChange={formik.handleChange}
              className="w-full font-roboto-400 focus:outline-none"
              maxLength={11}
            />
          </div>
          {formik.touched.payload && formik.errors.payload ? (
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
              onChange={formik.handleChange}
              className="w-full font-roboto-400 focus:outline-none"
              maxLength={14}
            />
          </div>
          {formik.touched.payload && formik.errors.payload ? (
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
                <Field type="radio" name={fieldName} value={option} />
                <Typography variant="footnote1">{option}</Typography>
              </div>
            ))}
          {formik.touched.payload && formik.errors.payload ? (
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
                />
                <label htmlFor={option} className="cursor-pointer">
                  <Typography variant="footnote1">{option}</Typography>
                </label>
              </div>
            ))}
          {formik.touched.payload && formik.errors.payload ? (
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
              onChange={formik.handleChange}
              className="w-full font-roboto-400 focus:outline-none"
            />
          </div>
          {formik.touched.payload && formik.errors.payload ? (
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
              onChange={formik.handleChange}
              className="w-full font-roboto-400 focus:outline-none"
              maxLength={11}
            />
          </div>
          {formik.touched.payload && formik.errors.payload ? (
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
          <div>
            <Button
              label="Anexar arquivo(s)"
              color="info"
              outlined
              type="button"
              onClick={() =>
                openModal(
                  <AddAttachmentsModal
                    setFileList={setFiles}
                    name={fieldName}
                    formik={formik}
                  />
                )
              }
            />
            <AttachmentUploadList
              fileList={files}
              procedure={procedure}
              fieldName={fieldName}
              formik={formik}
              value={value}
            />
          </div>
          {formik.touched.payload && formik.errors.payload ? (
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
    case FieldType.time:
      return (
        <>
          <div className="w-full border h-12 rounded flex items-center px-4 focus-within:border-2 focus-within:border-info">
            <input
              type="time"
              name={fieldName}
              value={value}
              onChange={formik.handleChange}
              className="w-full font-roboto-400 focus:outline-none"
            />
          </div>
          {formik.touched.payload && formik.errors.payload ? (
            formik.errors.payload[index]?.value ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.payload[index].value}
              </Typography>
            ) : null
          ) : null}
        </>
      );
    case FieldType.date:
      return (
        <>
          <div className="w-full border h-12 rounded flex items-center px-4 focus-within:border-2 focus-within:border-info">
            <input
              type="date"
              name={fieldName}
              value={value}
              onChange={formik.handleChange}
              className="w-full font-roboto-400 focus:outline-none"
            />
          </div>
          {formik.touched.payload && formik.errors.payload ? (
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
              className="w-full font-roboto-400 h-full focus:outline-none bg-white"
              name={fieldName}
              onChange={formik.handleChange}
            >
              <option value={value}>{value}</option>
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
          {formik.touched.payload && formik.errors.payload ? (
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
              onChange={formik.handleChange}
              className="w-full font-roboto-400 focus:outline-none"
            />
          </div>
          {formik.touched.payload && formik.errors.payload ? (
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
          <div className="w-full border h-12 rounded flex items-center px-4 focus-within:border-2 focus-within:border-info">
            <Field
              name={fieldName}
              type="text"
              className="w-full h-full font-roboto-400 focus:outline-none"
              value={value}
            />
          </div>
          {formik.touched.payload && formik.errors.payload ? (
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
          <div className="w-full border h-24 rounded flex items-center px-4 focus-within:border-2 focus-within:border-info">
            <Field
              as="textarea"
              className="w-full font-roboto-400 focus:outline-none resize-none"
              name={fieldName}
              value={value}
            />
          </div>
          {formik.touched.payload && formik.errors.payload ? (
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

export default UpdateFieldTypes;
