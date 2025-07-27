import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ActionBox, Button, Checkbox, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { DeleteUserFromGroupProps } from './types';

const Delete = ({ onSubmit, userGroup }: DeleteUserFromGroupProps) => {
  const { closeModal } = useModal();

  const formik = useFormik({
    initialValues: {
      checkbox: false,
    },
    validationSchema: Yup.object().shape({
      checkbox: Yup.bool().oneOf(
        [true],
        'Marque a caixa acima para prosseguir'
      ),
    }),
    onSubmit: () => {
      onSubmit();
    },
  });

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Excluir grupo"
          color="error"
          icon="group"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-4">
            <Typography variant="footnote1">
              Você tem certeza que quer excluir o grupo abaixo?
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {userGroup.name}
            </Typography>
            <Typography variant="footnote1">
              Ao clicar em excluir, o grupo será removido <b>permanentemente</b>{' '}
              da instituição.
            </Typography>
            <span className="flex space-x-2 justify-start items-center">
              <Checkbox
                id="checkbox"
                name="checkbox"
                onChange={formik.handleChange}
                checked={formik.values.checkbox}
              />
              <label htmlFor="checkbox" className="cursor-pointer">
                <Typography variant="footnote1">
                  Estou ciente de que o grupo será excluído permanentemente.
                </Typography>
              </label>
            </span>
            {formik.errors.checkbox ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.checkbox}
              </Typography>
            ) : null}
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button type="button" onClick={closeModal} label="Cancelar" />
          <Button
            color="error"
            type="submit"
            label="Excluir grupo"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default Delete;
