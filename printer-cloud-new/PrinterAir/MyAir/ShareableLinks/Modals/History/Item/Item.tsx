import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Icon, Paper, Typography } from 'printer-ui';
import { useSnackbar } from '../../../../../../hooks';
import { ShareableLinksModalHistoryItemProps } from './types';

const ShareableLinksModalHistoryItem = ({
  shareableLinks,
  onSubmit,
}: ShareableLinksModalHistoryItemProps) => {
  const { showSnackbar } = useSnackbar();

  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const [checkedError, setCheckedError] = React.useState<String>('');

  return (
    <>
      {shareableLinks.map((shareableLink) => (
        <Paper
          h="full"
          w="full"
          color="lighterGray"
          className="sm:px-1"
          key={shareableLink.id}
        >
          <div className="sm:flex items-center py-1 justify-between">
            {shareableLink.expiresIn === null ? (
              <div className="flex items-center">
                <Icon alt="infinite" name="infinite" fill w={28} h={28} />
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  className="pl-1"
                >
                  Permanente
                </Typography>
              </div>
            ) : (
              <div className="flex items-center">
                <Icon alt="clock" name="clock" stroke w={28} h={28} />
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  className="sm:pl-1"
                >
                  Expira em:
                </Typography>
                <Typography variant="footnote1" className="sm:pl-1 pl-2">
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                  }).format(new Date(shareableLink.expiresAt))}
                </Typography>
              </div>
            )}
            <div className="flex items-center mr-2">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="sm:pl-1 pl-2"
              >
                Data de criação:
              </Typography>
              <Typography variant="footnote1" className="sm:pl-1 pl-2">
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                }).format(new Date(shareableLink.createdAt))}
              </Typography>
            </div>
          </div>
          <div className="sm:flex">
            <div
              id={`linkIndex${shareableLink.id}`}
              data-tooltip-content={shareableLink.link}
              className="sm:ml-1 bg-white w-full sm:h-12 h-16 shadow-sm border-2 border-lightGray rounded-lg items-center flex sm:truncate overflow-x-auto"
            >
              <ReactTooltip anchorId={`linkIndex${shareableLink.id}`} />
              <Typography variant="footnote1" className="m-3 sm:truncate">
                {shareableLink.link}
              </Typography>
            </div>
            <div className="flex mx-2 my-1 truncate sm:hidden">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="pr-1"
              >
                Criado por:
              </Typography>
              {shareableLink.createdBy === null ? (
                <Typography variant="footnote1" className="truncate italic">
                  Histórico anterior a 01/09/2023
                </Typography>
              ) : (
                <Typography variant="footnote1" className="truncate">
                  {shareableLink.createdBy?.name}
                </Typography>
              )}
            </div>
            <div className="items-center sm:flex mx-2 mb-3 space-x-2 hidden">
              <button
                onClick={() =>
                  shareableLink.expiresIn
                    ? onSubmit(shareableLink.id)
                    : isChecked
                    ? onSubmit(shareableLink.id)
                    : setCheckedError('* Marque a caixa acima para prosseguir')
                }
                className="w-12 h-12 bg-error rounded-md flex justify-center items-center"
              >
                <Icon
                  alt="delete"
                  name="trashV2"
                  w={25}
                  h={25}
                  fill
                  stroke
                  color="white"
                />
              </button>
              <CopyToClipboard
                text={shareableLink.link}
                onCopy={() => showSnackbar(`Link copiado!`, 'success')}
              >
                <button
                  type="button"
                  className="w-12 h-12 bg-info rounded-md flex justify-center items-center"
                >
                  <Icon
                    alt="copy"
                    name="duplicateV2"
                    w={25}
                    h={25}
                    fill
                    color="white"
                  />
                </button>
              </CopyToClipboard>
            </div>
            {shareableLink.expiresIn === null && (
              <>
                <div className="flex space-x-2 p-2 sm:hidden">
                  <input
                    id="removeCheckbox"
                    type="checkbox"
                    name="react-tips"
                    value="checked"
                    checked={isChecked}
                    onChange={() => setIsChecked((current) => !current)}
                  />
                  <label htmlFor="removeCheckbox" className="cursor-pointer">
                    <Typography variant="footnote1">
                      Estou ciente que irei remover o link
                    </Typography>
                  </label>
                </div>
                <div className="pl-6 sm:hidden">
                  {isChecked === false && checkedError ? (
                    <Typography variant="footnote2" color="error">
                      {checkedError}
                    </Typography>
                  ) : null}
                </div>
              </>
            )}
            <div className="justify-between items-center flex sm:hidden pt-2 pb-2">
              <Button
                label="Excluir"
                color="error"
                onClick={() =>
                  shareableLink.expiresIn
                    ? onSubmit(shareableLink.id)
                    : isChecked
                    ? onSubmit(shareableLink.id)
                    : setCheckedError('* Marque a caixa acima para prosseguir')
                }
                className="w-32 h-12 rounded-md flex justify-center items-center"
              >
                <Icon
                  alt="delete"
                  name="trashV2"
                  w={25}
                  h={25}
                  fill
                  stroke
                  color="white"
                />
              </Button>
              <CopyToClipboard
                text={shareableLink.link}
                onCopy={() => showSnackbar(`Link copiado!`, 'success')}
              >
                <Button
                  label="Copiar"
                  color="blue"
                  type="button"
                  className="w-32 h-12 bg-info rounded-md flex justify-center items-center"
                >
                  <Icon
                    alt="copy"
                    name="duplicateV2"
                    w={25}
                    h={25}
                    fill
                    color="white"
                  />
                </Button>
              </CopyToClipboard>
            </div>
          </div>
          {shareableLink.expiresIn === null ? (
            <>
              <div className="sm:flex space-x-2 pb-2 hidden justify-between sm:w-full">
                <div className="pl-2 flex items-center space-x-2 sm:w-6/12">
                  <input
                    id="removeCheckbox"
                    type="checkbox"
                    name="react-tips"
                    value="checked"
                    checked={isChecked}
                    onChange={() => setIsChecked((current) => !current)}
                  />
                  <label htmlFor="removeCheckbox" className="cursor-pointer">
                    <Typography variant="footnote1">
                      Estou ciente que irei remover o link
                    </Typography>
                  </label>
                </div>
                <div className="flex justify-end truncate sm:w-6/12 pr-2">
                  <Typography
                    variant="footnote1"
                    family="robotoMedium"
                    className="pr-1"
                  >
                    Criado por:
                  </Typography>
                  {shareableLink.createdBy === null ? (
                    <Typography variant="footnote1" className="truncate italic">
                      Histórico anterior a 01/09/2023
                    </Typography>
                  ) : (
                    <Typography variant="footnote1" className="truncate">
                      {shareableLink.createdBy?.name}
                    </Typography>
                  )}
                </div>
              </div>
              <div className="pl-6">
                {isChecked === false && checkedError ? (
                  <Typography variant="footnote2" color="error">
                    {checkedError}
                  </Typography>
                ) : null}
              </div>
            </>
          ) : (
            <div className="sm:flex hidden pl-2 pb-2 truncate sm:w-full">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="pr-1"
              >
                Criado por:
              </Typography>
              {shareableLink.createdBy === null ? (
                <Typography variant="footnote1" className="truncate italic">
                  Histórico anterior a 01/09/2023
                </Typography>
              ) : (
                <Typography variant="footnote1" className="truncate">
                  {shareableLink.createdBy?.name}
                </Typography>
              )}
            </div>
          )}
        </Paper>
      ))}
    </>
  );
};
export default ShareableLinksModalHistoryItem;
