import { Button, Typography } from 'printer-ui';
import * as React from 'react';
import ResetAssigneeForm from './ResetAssignee';
import TaskStatus from './Status';
import TaskPriority from './Priority';
import RefuseJustificationNote from './RefuseJustificationNote';

const TaskInfo = ({ task, resetGroupAssignee, setResetGroupAssignee }) => {
  const day = new Date();

  const term = task.deadline ? new Date(task.deadline) : new Date();

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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Typography variant="footnote1" family="robotoMedium">
          Nome da tarefa:
        </Typography>
        <Typography variant="footnote1">{task.name}</Typography>
      </div>
      <div className="space-y-2">
        <Typography variant="footnote1" family="robotoMedium">
          Data de criação da tarefa:
        </Typography>
        <Typography variant="footnote1">
          {new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          }).format(
            new Date(
              new Date(task.createdAt).toISOString().replace('.000Z', '')
            )
          )}
        </Typography>
      </div>
      <div className="space-y-2 min-w-[320px]">
        <Typography variant="footnote1" family="robotoMedium">
          Descrição:
        </Typography>

        <div className="h-full max-h-16 py-1 overflow-y-auto">
          <Typography variant="footnote1">{task.description}</Typography>
        </div>
      </div>
      <div className="space-y-2 min-h-[40px]">
        {resetGroupAssignee === false ? (
          <>
            <Typography variant="footnote1" family="robotoMedium">
              Destino:
            </Typography>
            {task.groupAssignee ? (
              <div className="space-y-2 min-h[54px]">
                <Typography variant="footnote1">
                  {task.groupAssignee?.name}
                </Typography>
              </div>
            ) : (
              <Typography variant="footnote1" className="italic" color="gray">
                Destino não definido
              </Typography>
            )}
            {task.status === 'running' || task.status === 'started' ? (
              <Button
                label="Redefinir destino"
                color="info"
                outlined
                size="sm"
                onClick={() => {
                  setResetGroupAssignee(true);
                }}
              />
            ) : null}
          </>
        ) : (
          <ResetAssigneeForm
            task={task}
            setResetGroupAssignee={setResetGroupAssignee}
            resetGroupAssignee={resetGroupAssignee}
          />
        )}
      </div>

      <div className="grid sm:grid-cols-2 min-h-[54px]">
        {task.assignee !== null ? (
          <div className="space-y-3">
            <Typography variant="footnote1" family="robotoMedium">
              Responsável:
            </Typography>
            <Typography variant="footnote1">{task.assignee.name}</Typography>
          </div>
        ) : (
          <div className=" space-y-3 min-h-[54px]">
            <Typography variant="footnote1" family="robotoMedium">
              Responsável:
            </Typography>
            <Typography variant="footnote1" className="italic" color="gray">
              Responsável não definido
            </Typography>
          </div>
        )}
        <div className="space-y-3 min-h-[40px]">
          <Typography variant="footnote1" family="robotoMedium">
            Prazo:
          </Typography>
          {task.deadline !== null ? (
            <div className="flex space-x-2 items-center">
              <Typography variant="footnote1">
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                }).format(
                  new Date(
                    new Date(task.deadline).toISOString().replace('.000Z', '')
                  )
                )}{' '}
                -
              </Typography>
              {deadlines(deadlineDays)}
            </div>
          ) : (
            <Typography variant="footnote1" className="italic" color="gray">
              Prazo não definido
            </Typography>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2">
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Status da tarefa:
          </Typography>
          <div className="flex flex-row items-center space-x-3">
            <TaskStatus status={task.status} />
          </div>
        </div>
        <div className="space-y-2 sm:mt-0 mt-2">
          <Typography variant="footnote1" family="robotoMedium">
            Prioridade:
          </Typography>
          <div className="flex flex-row items-center space-x-3">
            <TaskPriority priority={task.priority} />
          </div>
        </div>
      </div>
      {task.status === 'refused' ? (
        <RefuseJustificationNote justifiableId={task.id} />
      ) : null}
    </div>
  );
};

export default TaskInfo;
