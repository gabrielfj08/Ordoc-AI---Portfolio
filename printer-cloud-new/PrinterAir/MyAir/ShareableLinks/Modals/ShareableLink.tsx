import * as React from 'react';
import { useFormik } from 'formik';
import { queryClient } from '../../../../queryClient';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { ActionBox, Button, Icon, Typography } from 'printer-ui';
import { useModal, useSnackbar } from '../../../../hooks';
import {
  CreateShareableLinkFormValues,
  ShareableLinksModalProps,
} from './types';
import ShareableLinksHistoryModal from './History';

const ShareableLinksModal = ({
  onSubmit,
  documentId,
}: ShareableLinksModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const [link, setLink] = React.useState<string>('');
  const [isError, setIsError] = React.useState<string>('');

  const initialValues: CreateShareableLinkFormValues = {
    expiresIn: 86400,
  };

  const formik = useFormik<CreateShareableLinkFormValues>({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values)
        .then((res) => {
          setLink(res.link);
          queryClient.invalidateQueries(['documents']);
        })
        .catch((error) => {
          if (error.response.status >= 400 && error.response.status < 500) {
            showSnackbar(error.response.data.message, 'warning');
          } else {
            setIsError;
            showSnackbar(
              'Oops, não foi possível gerar o link. Tente novamente mais tarde.',
              'error'
            );
          }
        });
    },
  });

  return (
    <div className="bg-transparent">
      <ActionBox>
        <form onSubmit={formik.handleSubmit}>
          <ActionBox.Header
            title="Gerar link"
            color="blue"
            icon="link"
            onClose={closeModal}
            fill
          />
          <ActionBox.Content>
            <div className="sm:w-[569px] w-72">
              <div className="justify-center items-center grid">
                <Typography variant="headline" family="robotoMedium">
                  Escolha a duração do link:
                </Typography>
              </div>
              <div className="sm:flex w-full justify-center items-center mt-3 sm:mt-6 pl-8 sm:pl-0 space-y-2 sm:space-y-0 sm:space-x-10 sm:space-between">
                <div className="sm:flex grid grid-cols-2 justify-between">
                  <div className="flex space-x-2">
                    <input
                      id="oneDay"
                      type="radio"
                      name="expiresIn"
                      value={86400}
                      checked={formik.values.expiresIn === 86400}
                      onChange={formik.handleChange}
                    />
                    <label htmlFor="oneDay" className="cursor-pointer">
                      <Typography variant="footnote1">Um dia</Typography>
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      className="sm:ml-10"
                      id="week"
                      type="radio"
                      name="expiresIn"
                      value={604800}
                      onChange={formik.handleChange}
                    />
                    <label htmlFor="week" className="cursor-pointer">
                      <Typography variant="footnote1">Uma semana</Typography>
                    </label>
                  </div>
                </div>
                <div className="sm:flex grid grid-cols-2 justify-between">
                  <div className="flex space-x-2">
                    <input
                      id="month"
                      type="radio"
                      name="expiresIn"
                      value={2592000}
                      onChange={formik.handleChange}
                    />
                    <label htmlFor="month" className="cursor-pointer">
                      <Typography variant="footnote1">Um mês</Typography>
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      className="sm:ml-10"
                      id="permanent"
                      type="radio"
                      name="expiresIn"
                      value={''}
                      onChange={formik.handleChange}
                    />
                    <label htmlFor="permanent" className="cursor-pointer">
                      <Typography variant="footnote1">Permanente</Typography>
                    </label>
                  </div>
                </div>
              </div>
              <div
                id="linkId"
                data-tooltip-content={link}
                className="sm:ml-1 pr-2 mt-6 sm:w-full w-72 sm:h-12 h-16 shadow-sm border-2 border-lightGray rounded-lg items-center justify-between flex sm:truncate mr-2"
              >
                <ReactTooltip anchorId="linkId" />
                <Typography
                  variant="footnote1"
                  color="gray"
                  className="m-3 pr-2 sm:truncate"
                >
                  {isError ? (
                    isError
                  ) : link ? (
                    link
                  ) : (
                    <span>O link gerado irá aparecer aqui</span>
                  )}
                </Typography>
                <div className="justify-end items-center flex">
                  <CopyToClipboard
                    text={link}
                    onCopy={() => showSnackbar(`Link copiado!`, 'success')}
                  >
                    <button
                      disabled={!link}
                      type="button"
                      className={`w-9 h-9 m-2 ${
                        link ? 'bg-info' : 'bg-gray'
                      }  rounded-md flex justify-center items-center -ml-8`}
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
              </div>
            </div>
          </ActionBox.Content>
          <ActionBox.Footer>
            <Button
              type="button"
              color="error"
              onClick={closeModal}
              label="Cancelar"
            />
            <Button
              type="submit"
              color="blue"
              label="Gerar link"
              disabled={formik.isSubmitting}
            />
          </ActionBox.Footer>
        </form>
      </ActionBox>
      <div className="bg-transparent">
        <div className="h-5" />
        <ActionBox>
          <ActionBox.Content>
            <div className="sm:w-[569px] w-72">
              <div className="justify-center items-center grid mb-3">
                <Typography variant="headline" family="robotoMedium">
                  Histórico de links
                </Typography>
              </div>
              <div className="space-y-4 p-2 overflow-y-auto h-fit max-h-52">
                <ShareableLinksHistoryModal documentId={documentId} />
              </div>
            </div>
          </ActionBox.Content>
        </ActionBox>
      </div>
    </div>
  );
};

export default ShareableLinksModal;
