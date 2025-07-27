import * as React from 'react';
import { Button } from 'printer-ui';
import { queryClient } from '../../../../../queryClient';
import { useAuth, useModal, useSnackbar } from '../../../../../hooks';
import { SignatureService } from '../../../../../services/printer-flow';
import { SignatureActionsDocumentProps } from './types';
import SignatureActionsForm from './ActionsForm';
import RefuseJustificationNote from './RefuseJustificationNote';

const SignatureActionsDocument = ({
  signature,
}: SignatureActionsDocumentProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { closeModal } = useModal();
  const [isFormVisible, setFormVisibility] = React.useState<boolean>(false);

  const toggleFormVisibility = () => {
    setFormVisibility((current) => !current);
  };

  return isFormVisible ? (
    <div className="mb-5">
      <SignatureActionsForm
        onClose={toggleFormVisibility}
        signatureId={signature.id}
      />
    </div>
  ) : (
    <div className="flex space-x-4 justify-between my-5">
      {signature.status === 'created' ? (
        <>
          <Button
            label="Cancelar"
            size="md"
            color="gray"
            onClick={closeModal}
          />
          <div className="sm:flex sm:items-right sm:space-x-3 sm:space-y-0 space-y-2">
            <Button
              className="sm:hidden flex"
              label="Recusar assinatura"
              size="md"
              color="error"
              onClick={toggleFormVisibility}
            />
            <Button
              className="hidden sm:flex"
              label="Recusar solicitação de assinatura"
              size="md"
              color="error"
              onClick={toggleFormVisibility}
            />
            <Button
              label="Assinar documento"
              size="md"
              color="info"
              onClick={() => {
                SignatureService.sign(token, subdomain, signature.id)
                  .then(() => {
                    closeModal();
                    showSnackbar('Documento assinado com sucesso.', 'success');
                    queryClient.invalidateQueries([
                      'signaturesCount',
                      token,
                      subdomain,
                    ]);
                    queryClient.invalidateQueries([
                      'indexSignatures',
                      token,
                      subdomain,
                      {},
                    ]);
                  })
                  .catch((err) =>
                    showSnackbar(err.response.data.message, 'error')
                  );
              }}
            />
          </div>
        </>
      ) : (
        <div>
          <RefuseJustificationNote signature={signature} />
        </div>
      )}
    </div>
  );
};

export default SignatureActionsDocument;
