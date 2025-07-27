import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { cnpjMask, cpfMask, phoneNumberMask } from '../../../../utils';
import { SessionGroupRequesterProvider } from '../../../../hooks';
import { ShowProcedureFieldsProps } from './types';
import UpdateProcedureFields from '../../Update';
import AttachmentList from './AttachmentView/AttachmentList';

const ShowProcedureFields = ({ procedure }: ShowProcedureFieldsProps) => {
  const [edit, setEdit] = React.useState<boolean>(false);

  const fieldTypeMasks = ({ type, value }) => {
    switch (type) {
      case 'short_text':
        return value;
      case 'long_text':
        return value;
      case 'email':
        return value;
      case 'numeric':
        return value;
      case 'phone':
        return phoneNumberMask(value);
      case 'date':
        return new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(new Date(value).toISOString().replace('.000Z', '')));
      case 'time':
        return value;
      case 'cnpj':
        return cnpjMask(value);
      case 'checkbox':
        return value.map((value) => value).join(', ');
      case 'radio':
        return value;
      case 'select_field':
        return value;
      case 'cpf':
        return cpfMask(value);
    }
  };

  return (
    <SessionGroupRequesterProvider>
      <main>
        {edit === false ? (
          <div className="mt-11 mb-8 w-full sm:pr-10 px-4">
            <div className="absolute bg-white -mt-2.5 sm:-mt-3.5 ml-4 sm:ml-10 px-3 w-fit">
              <Typography family="robotoMedium">Campos do processo</Typography>
            </div>
            <div className="border rounded-2xl px-4 py-7 mt-3 w-full">
              {procedure.schema.length ? (
                <div className=" flex space-x-4">
                  <div className="sm:grid sm:grid-cols-2 gap-6 space-y-6 sm:space-y-0 w-full">
                    {procedure.payload.map((payloadItem) =>
                      payloadItem.fieldType === 'attachment' ? (
                        <div className="w-full" key={payloadItem.value}>
                          <AttachmentList
                            procedureId={procedure.id}
                            fieldName={payloadItem.label}
                            attachmentUuids={payloadItem.value}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2" key={payloadItem.value}>
                          <Typography variant="footnote1" family="robotoMedium">
                            {payloadItem.label}:
                          </Typography>
                          <Typography variant="footnote1">
                            {fieldTypeMasks({
                              type: payloadItem.fieldType,
                              value: payloadItem.value,
                            })}
                          </Typography>
                        </div>
                      )
                    )}
                  </div>
                  {procedure.status === 'draft' ? (
                    <button
                      className="bg-info h-fit w-fit p-2 rounded-md"
                      onClick={() => setEdit(true)}
                    >
                      <Icon
                        name="write"
                        alt="edit"
                        color="white"
                        fill
                        stroke
                        w={24}
                        h={24}
                      />
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-4">
                  <Icon
                    alt="info"
                    name="info"
                    color="gray"
                    stroke
                    w={28}
                    h={28}
                  />
                  <Typography
                    variant="footnote1"
                    color="gray"
                    className="italic"
                  >
                    Este processo não possui campos.
                  </Typography>
                </div>
              )}
            </div>
          </div>
        ) : (
          <UpdateProcedureFields procedure={procedure} setEdit={setEdit} />
        )}
      </main>
    </SessionGroupRequesterProvider>
  );
};

export default ShowProcedureFields;
