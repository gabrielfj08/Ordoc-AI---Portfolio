import * as React from 'react';
import { SnackbarV3 } from 'printer-ui';
import { useV3ActionSheet } from '../../../../hooks';

const SignatureProcessActionSheet = ({ signatureProcess }) => {
  const { closeActionSheet } = useV3ActionSheet();

  React.useEffect(() => {
    if (signatureProcess.status !== 'running') {
      closeActionSheet();
    }
  }, [signatureProcess.status]);

  return (
    <div>
      <SnackbarV3
        className="mb-1.5 sm:mb-6 mx-6"
        message="O documento está sendo assinado. Por favor, aguarde um momento."
        title="Assinatura em processo..."
        onClick={closeActionSheet}
        type="loading"
      />
    </div>
  );
};

export default SignatureProcessActionSheet;
