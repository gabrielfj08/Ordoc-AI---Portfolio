import * as React from 'react';
import { useFormik } from 'formik';
import { ActionBox, Button, Icon, Typography } from 'printer-ui';
import { useModal } from '../../../../../hooks';
import { AvatarProps, AvatarFormValues } from './types';
import { Avatar } from 'printer-ui';

const AvatarModal = ({ onSubmit, user }: AvatarProps) => {
  const { closeModal } = useModal();
  const [isLoading] = React.useState(false);
  const [previewURL, setPreviewURL] = React.useState<string>(user.avatarUrl);

  const initialValues: AvatarFormValues = {
    avatarFile: null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      if (!values.avatarFile) return;

      onSubmit(values.avatarFile);
      closeModal();
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) return;

    setPreviewURL(URL.createObjectURL(event.currentTarget.files[0]));

    formik.setFieldValue('avatarFile', event.currentTarget.files[0]);
  };

  return (
    <ActionBox>
      <ActionBox.Header
        title="Foto de perfil"
        color="blue"
        onClose={closeModal}
        icon="photo"
      />
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Content>
          <Typography variant="footnote1">
            Sua foto terá uma aparência melhor se seguir estes padrões:
          </Typography>
          <Typography variant="footnote1" className="pt-6 sm:w-[30rem] w-36">
            <b>Formato:</b> JPG ou PNG.
          </Typography>
          <Typography variant="footnote1" className="pt-2">
            <b>Tamanho:</b> entre 20 KB e 5 MB.
          </Typography>
          <Typography variant="footnote1" className="py-2">
            <b>Resolução recomendada:</b> 720 px de altura e 720 px de largura.
          </Typography>
          <div className="flex justify-center border-t-2 border-lightGray">
            <div className="mt-4 items-center justify-center">
              <label htmlFor="avatarFile" className="cursor-pointer">
                <Avatar
                  size="xl2"
                  src={previewURL}
                  className="w-36 h-36 rounded-full ml-10 mb-2"
                  placeholder={user.name.charAt(0)}
                />

                <div className="w-56 flex justify-center items-center space-x-2">
                  <Icon
                    alt="photo"
                    name="photo"
                    color="info"
                    w={24}
                    h={24}
                    fill
                    stroke
                  ></Icon>
                  <Typography
                    variant="footnote1"
                    family="robotoBold"
                    color="info"
                  >
                    Fazer upload da imagem
                  </Typography>
                  <input
                    id="avatarFile"
                    name="avatarFile"
                    hidden
                    type="file"
                    onChange={handleChange}
                    accept="image/*"
                    required
                  />
                </div>
              </label>
            </div>
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button
            className="px-8"
            color="red"
            type="button"
            onClick={closeModal}
            label="Cancelar"
          />
          <Button
            className="px-10"
            color="info"
            type="submit"
            label="Salvar"
            disabled={isLoading}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default AvatarModal;
