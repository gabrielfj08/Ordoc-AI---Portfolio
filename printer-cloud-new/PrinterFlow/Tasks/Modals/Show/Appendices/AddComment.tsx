import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Button, TextArea, Typography } from 'printer-ui';
import { noEmojiValidator } from '../../../../../utils';
import { useSnackbar } from '../../../../../hooks';
import {
  AddCommentaskFormValues,
  AddCommentModalAppendiceProps,
} from './types';

const AddCommentModalAppendice = ({
  onSubmit,
  commentModalVisibility,
  setCommentModalVisibility,
}: AddCommentModalAppendiceProps) => {
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    body: '',
  } as AddCommentaskFormValues;

  return (
    <ActionBox className="sm:w-[569px]">
      <div className={commentModalVisibility ? 'block' : 'hidden'}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values)
              .then(() => {
                showSnackbar(`Comentário adicionado com sucesso.`, 'success');
                setCommentModalVisibility(false);
                resetForm();
              })
              .catch((error) => {
                showSnackbar(error.response.data.message, 'error');
              });
          }}
          validationSchema={Yup.object().shape({
            body: Yup.string()
              .required('Campo obrigatório')
              .test(
                'regex',
                'Não utilize emojis (desenhos ou pictogramas).',
                noEmojiValidator
              ),
          })}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(formik) => (
            <Form>
              <ActionBox.Content>
                <div className="w-full min-w-[320px] space-y-4">
                  <Typography variant="footnote1" family="robotoMedium">
                    Comentário*:
                  </Typography>
                  <div className="sm:hidden block">
                    <TextArea
                      name="body"
                      className="px-5"
                      cols={30}
                      rows={3}
                      onChange={formik.handleChange}
                      value={formik.values.body}
                    />
                    {formik.touched.body && formik.errors.body ? (
                      <Typography variant="footnote2" color="error">
                        * {formik.errors.body}
                      </Typography>
                    ) : null}
                  </div>
                  <div className="hidden sm:block">
                    <TextArea
                      name="body"
                      className="px-5"
                      cols={51}
                      rows={3}
                      onChange={formik.handleChange}
                      value={formik.values.body}
                    />
                    {formik.touched.body && formik.errors.body ? (
                      <Typography variant="footnote2" color="error">
                        * {formik.errors.body}
                      </Typography>
                    ) : null}
                  </div>
                </div>
              </ActionBox.Content>
              <ActionBox.Footer>
                <Button
                  type="button"
                  color="gray"
                  label="Cancelar"
                  onClick={() => setCommentModalVisibility(false)}
                />
                <Button
                  type="submit"
                  color="info"
                  label="Comentar"
                  disabled={formik.isSubmitting}
                />
              </ActionBox.Footer>
            </Form>
          )}
        </Formik>
      </div>
    </ActionBox>
  );
};

export default AddCommentModalAppendice;
