import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { SessionGroupRequesterProvider, useModal } from '../../../../hooks';
import { getRequesterType } from '../../../../utils';
import { ShowProcedureInfoProps } from './types';
import Visibility from './ProceduresInfoCases.tsx/Visibility';
import Priority from './ProceduresInfoCases.tsx/Priority';
import Status from './ProceduresInfoCases.tsx/Status';
import EditProcedureModal from '../../Modals/Edit';

const ShowProcedureInfo = ({
  procedure,
  justificationNote,
}: ShowProcedureInfoProps) => {
  const { openModal } = useModal();

  const day = new Date();

  const term = procedure.deadline ? new Date(procedure.deadline) : new Date();

  const diffTime = Number(term) - Number(day);

  const deadlineDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const deadlines = (prazo) => {
    switch (true) {
      case prazo >= 1:
        return <Typography variant="footnote1">Faltam {prazo} dias</Typography>;
      case prazo === 0:
        return (
          <Typography variant="footnote1" color="orange">
            Vence hoje
          </Typography>
        );
      case prazo <= 0:
        return (
          <Typography variant="footnote1" color="error">
            Vencido
          </Typography>
        );
      default:
        return null;
    }
  };

  const iconRequester = () => {
    if (procedure.requester.type) {
      if (getRequesterType(procedure.requester.type) === 'ExternalRequester') {
        return 'external';
      } else {
        return 'internal';
      }
    }
    return 'internal';
  };

  const colorIconRequester = () => {
    if (procedure.requester.type) {
      if (getRequesterType(procedure.requester.type) === 'ExternalRequester') {
        return 'orange';
      } else {
        return 'black';
      }
    }
    return 'black';
  };

  return (
    <SessionGroupRequesterProvider>
      <main className="sm:pr-10 px-4">
        <div className="mt-11 mb-8">
          <div className="absolute bg-white -mt-2.5 sm:-mt-3.5 ml-4 sm:ml-10 px-3">
            <Typography family="robotoMedium">Dados do processo</Typography>
          </div>
          <div className="border rounded-2xl px-4 py-7 mt-3 w-full">
            <div className="flex space-x-4">
              <div className="sm:grid sm:grid-cols-2 gap-6 space-y-2 sm:space-y-0 w-full">
                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Status do processo:
                  </Typography>
                  <div className="flex items-center py-2">
                    <Status procedure={procedure} />
                  </div>
                </div>

                {procedure.status === 'archived' ? (
                  <div>
                    <Typography variant="footnote1" family="robotoMedium">
                      Justificativa do arquivamento:
                    </Typography>
                    <div className="py-3">
                      <Typography variant="footnote1">
                        {justificationNote[0]?.note}
                      </Typography>
                    </div>
                  </div>
                ) : null}
                {procedure.status === 'finished' ? (
                  <div>
                    <Typography variant="footnote1" family="robotoMedium">
                      Finalizado por:
                    </Typography>
                    <div className="py-3">
                      <Typography variant="footnote1">
                        {justificationNote[0]?.createdBy.name}
                      </Typography>
                    </div>
                  </div>
                ) : null}

                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Criado por:
                  </Typography>
                  <div className="py-3">
                    <Typography variant="footnote1">
                      {procedure.createdBy?.name}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Grupo de origem:
                  </Typography>
                  <div className="py-3">
                    <Typography variant="footnote1">
                      {procedure.responsibleGroup?.name}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Solicitante:
                  </Typography>
                  <div className="flex items-center py-2">
                    <Icon
                      alt="requester"
                      name={iconRequester()}
                      fill
                      stroke
                      w={28}
                      h={28}
                      className="mr-2"
                      color={colorIconRequester()}
                    />
                    <Typography variant="footnote1">
                      {procedure.requester?.name}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Visibilidade:
                  </Typography>
                  <div className="flex items-center py-2">
                    <Visibility procedure={procedure} />
                  </div>
                </div>

                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Prioridade:
                  </Typography>
                  <div className="flex items-center py-2">
                    <Priority procedure={procedure} />
                  </div>
                </div>

                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Prazo:
                  </Typography>
                  <div className="py-3 flex items-center space-x-2">
                    {procedure.deadline !== null ? (
                      <>
                        <Typography variant="footnote1" className="mr-2">
                          {new Intl.DateTimeFormat('pt-BR', {
                            dateStyle: 'short',
                          }).format(
                            new Date(
                              new Date(procedure.deadline)
                                .toISOString()
                                .replace('.000Z', '')
                            )
                          )}
                        </Typography>
                        -{deadlines(deadlineDays)}
                      </>
                    ) : (
                      <Typography
                        variant="footnote1"
                        color="gray"
                        className="italic"
                      >
                        Prazo não definido
                      </Typography>
                    )}
                  </div>
                </div>

                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Tipo de processo:
                  </Typography>
                  <div className="py-3">
                    <Typography variant="footnote1">
                      {procedure.parentProcedureTemplateName
                        ? procedure.parentProcedureTemplateName
                        : procedure.procedureTemplateName}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="footnote1" family="robotoMedium">
                    Assunto do tipo de processo:
                  </Typography>
                  <div className="py-3">
                    {!procedure.parentProcedureTemplateName ? (
                      <Typography
                        variant="footnote1"
                        color="gray"
                        className="italic"
                      >
                        Sem assunto definido
                      </Typography>
                    ) : (
                      <Typography variant="footnote1">
                        {procedure.procedureTemplateName}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
              {procedure.status === 'draft' && procedure.payload.length ? (
                <button
                  className="bg-info h-fit w-fit p-2 rounded-md"
                  onClick={() =>
                    openModal(
                      <SessionGroupRequesterProvider>
                        <EditProcedureModal />
                      </SessionGroupRequesterProvider>
                    )
                  }
                >
                  <Icon
                    name="write"
                    alt="write"
                    color="white"
                    fill
                    stroke
                    w={24}
                    h={24}
                  />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </SessionGroupRequesterProvider>
  );
};

export default ShowProcedureInfo;
