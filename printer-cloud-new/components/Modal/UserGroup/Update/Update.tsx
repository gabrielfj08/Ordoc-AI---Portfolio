import * as React from 'react';
import * as Yup from 'yup';
import router from 'next/router';
import { useFormik } from 'formik';
import { ActionBox, Input, Button, Typography, TextArea } from 'printer-ui';
import { getSubdomain, noEmojiValidator } from '../../../../utils';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { UserGroupService } from '../../../../services';
import { UpdateGroupProps } from '../types';

const UpdateGroup = ({ group_id }: UpdateGroupProps) => {
  const { token, subdomain } = useAuth();
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const [groups, setGroups] = React.useState({
    description: '',
    name: '',
  });

  const getGroup = React.useCallback(async () => {
    UserGroupService.show(token, subdomain, group_id)
      .then((res) => {
        setGroups(res.data);
      })
      .catch(() => {});
  }, [group_id, token]);

  React.useEffect(() => {
    group_id && getGroup();
  }, [getGroup]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: groups.description,
      name: groups.name,
    },

    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required('Campo obrigatório')
        .matches(/^[^*]+$/, 'Nome não pode conter "*"')
        .test(
          'regex',
          'Não utilize emojis (desenhos ou pictogramas).',
          noEmojiValidator
        ),
      description: Yup.string().required('Campo obrigatório'),
    }),
    onSubmit: (values) => {
      UserGroupService.update(token, getSubdomain(), group_id, values)
        .then((res) => {
          closeModal();
          showSnackbar(`Informações salvas com sucesso.`, 'success');
          router.push(`/printer-cloud/user-groups/${group_id}`);
        })
        .catch((error) => {
          showSnackbar(error.response.data.message, 'error');
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Editar grupo"
          color="blue"
          icon="group"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-3">
            <div className="overflow-hidden sm:w-auto w-72">
              <Typography variant="headline" family="robotoMedium">
                Nome:
              </Typography>
            </div>
            <div className="sm:hidden block w-72">
              <Input
                size="md"
                w={72}
                type="text"
                id="name"
                name="name"
                placeholder=" "
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="hidden sm:block">
              <Input
                w="full"
                type="text"
                id="name"
                name="name"
                placeholder=" "
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.name}
              </Typography>
            ) : null}
            <Typography variant="headline" family="robotoMedium">
              Descrição:
            </Typography>
            <div className="sm:hidden block">
              <TextArea
                name="description"
                className="px-5"
                cols={26}
                rows={2}
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </div>
            <div className="hidden sm:block w-72">
              <TextArea
                name="description"
                className="px-5"
                cols={57}
                rows={3}
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </div>
            {formik.touched.description && formik.errors.description ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.description}
              </Typography>
            ) : null}
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button onClick={closeModal} label="Cancelar" type="button" />
          <Button
            color="blue"
            type="submit"
            label="Salvar alterações"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default UpdateGroup;
