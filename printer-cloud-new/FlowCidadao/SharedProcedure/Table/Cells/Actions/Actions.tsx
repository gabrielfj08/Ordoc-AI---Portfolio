import * as React from 'react';
import router from 'next/router';
import { Formik, Form } from 'formik';
import { TypographyV3 as Typography, Icon } from 'printer-ui';
import {
  AuthExternalProvider,
  useModal,
  useV3Snackbar,
} from '../../../../../hooks';
import { ActionsCellProps } from './types';
import RefuseSharedProcedureModal from '../../../../components/Procedures/RefuseSharedProcedure';

const ActionsCell = ({
  sharedProcedure,
  color,
  onSubmit,
}: ActionsCellProps) => {
  const { showV3Snackbar } = useV3Snackbar();
  const { openModal } = useModal();

  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {
        onSubmit()
          .then(() => {
            showV3Snackbar(
              'Agora você pode acompanhar o processo.',
              'success',
              'Compartilhamento aceito.'
            );
          })
          .catch((error) => {
            showV3Snackbar(
              error.response.data.message,
              'error',
              'Algo deu errado!'
            );
          });
      }}
      enableReinitialize
    >
      {(formik) => (
        <Form>
          <div className="flex items-end justify-around space-x-2">
            {sharedProcedure.status === 'accepted' ? (
              <>
                <button
                  className="flex flex-col ml-1 sm:ml-2 items-center"
                  type="button"
                  onClick={() =>
                    router.push(
                      `/flow-cidadao/procedures/${sharedProcedure.procedureId}`
                    )
                  }
                >
                  <Icon alt="ver" name="eye" fill h={23} w={23} color={color} />
                  <Typography
                    variant="bodySm"
                    family="jakartaLight"
                    color={color}
                  >
                    Ver
                  </Typography>
                </button>
                <button
                  className="flex flex-col items-center"
                  type="button"
                  onClick={() => {
                    openModal(
                      <AuthExternalProvider>
                        <RefuseSharedProcedureModal
                          sharedProcedure={sharedProcedure}
                        />
                      </AuthExternalProvider>
                    );
                  }}
                >
                  <Icon
                    alt="descartar"
                    name="circleClose"
                    stroke
                    h={20}
                    w={20}
                    color={color}
                  />
                  <Typography
                    variant="bodySm"
                    family="jakartaLight"
                    color={color}
                  >
                    Descartar
                  </Typography>
                </button>
              </>
            ) : (
              <>
                <button
                  className="flex flex-col items-center"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  <Icon
                    alt="aceitar"
                    name="checkV3"
                    stroke
                    h={20}
                    w={20}
                    color={color}
                  />
                  <Typography
                    variant="bodySm"
                    family="jakartaLight"
                    color={color}
                  >
                    Aceitar
                  </Typography>
                </button>
                <button
                  className="flex flex-col pr-1 items-center"
                  type="button"
                  onClick={() => {
                    openModal(
                      <AuthExternalProvider>
                        <RefuseSharedProcedureModal
                          sharedProcedure={sharedProcedure}
                        />
                      </AuthExternalProvider>
                    );
                  }}
                >
                  <Icon
                    alt="descartar"
                    name="circleClose"
                    stroke
                    h={20}
                    w={20}
                    color={color}
                  />
                  <Typography
                    variant="bodySm"
                    family="jakartaLight"
                    color={color}
                  >
                    Descartar
                  </Typography>
                </button>
              </>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ActionsCell;
