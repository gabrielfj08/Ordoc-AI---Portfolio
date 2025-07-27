import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ActionBox, Button, Checkbox, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { DeactivateGroupProps } from './types';

const Deactivate = ({ onSubmit, userGroup }: DeactivateGroupProps) => {
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
    onSubmit: () => onSubmit(),
  });

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Desativar grupo"
          color="error"
          icon="group"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-4">
            <Typography variant="footnote1">
              Você tem certeza que quer desativar o grupo abaixo?
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {userGroup.name}
            </Typography>
            <Typography variant="footnote1">
              Ao clicar em desativar, o grupo será desativado da instituição.
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
                  Estou ciente que o grupo será desativado.
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
            label="Desativar grupo"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default Deactivate;
