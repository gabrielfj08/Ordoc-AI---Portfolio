import * as React from 'react';
import { ButtonV3 as Button } from 'printer-ui';
import { useSession } from '../../../../../hooks';
import { SignatureExternalActionsProps } from './types';
import SignatureExternalActionsForm from './ActionsForm';
import RefuseJustificationNote from './RefuseJustificationNote';

const SignatureExternalActions = ({
  signature,
  onSubmit,
  refuseFormInitialState,
}: SignatureExternalActionsProps) => {
  const { themeColor } = useSession();
  const [isFormVisible, setFormVisibility] = React.useState<boolean>(
    refuseFormInitialState
  );

  const toggleFormVisibility = () => {
    setFormVisibility((current) => !current);
  };

  return isFormVisible ? (
    <div>
      <SignatureExternalActionsForm
        onClose={toggleFormVisibility}
        signatureId={signature.id}
      />
    </div>
  ) : (
    <>
      {signature.status === 'created' ? (
        <div className="sm:flex sm:flex-row flex flex-col items-center justify-center space-y-4 sm:space-y-0 sm:space-x-3 mt-5">
          <Button
            w={60}
            label="Recusar"
            size="md"
            style="outlined"
            color={themeColor}
            onClick={toggleFormVisibility}
          />
          <Button
            w={60}
            label="Assinar"
            size="md"
            color={themeColor}
            onClick={onSubmit}
          />
        </div>
      ) : (
        <div className="mt-5 space-y-1">
          <RefuseJustificationNote signature={signature} />
        </div>
      )}
    </>
  );
};

export default SignatureExternalActions;
