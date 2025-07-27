import * as React from 'react';
import { useFormik } from 'formik';
import { ActionBox, Button, Icon, Typography } from 'printer-ui';
import { InsertImageProps } from './types';
import { useModal } from '../../../../hooks';

const InsertImage = ({ organization, onSubmit }: InsertImageProps) => {
  const { closeModal } = useModal();

  const [previewURL, setPreviewURL] = React.useState<string>(
    organization.logoUrl
  );

  const initialValues: any = {
    logoFile: null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      if (!values.logoFile) return;

      onSubmit(values.logoFile);
      closeModal();
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) return;

    setPreviewURL(URL.createObjectURL(event.currentTarget.files[0]));

    formik.setFieldValue('logoFile', event.currentTarget.files[0]);
  };

  return (
    <ActionBox>
      <ActionBox.Header
        title="Logo da instituição"
        color="blue"
        icon="photo"
        stroke
        onClose={closeModal}
      />
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Content>
          <Typography variant="footnote1">
            Sua logo tera uma aparência melhor se seguir estes padrões:
            <p className="pt-6 leading-[1.172rem] w-[37rem]">
              <b>Formato:</b> JPG ou PNG.
            </p>
            <p className="pt-2">
              <b>Tamanho:</b> entre 20 KB e 5 MB.
            </p>
            <p className="py-2">
              <b>Resolução recomendada:</b> 720 px de altura e 720 px de
              largura.
            </p>
            <div className="flex justify-center border-t-2 border-lightGray">
              <label htmlFor="logoFile" className="cursor-pointer">
                <div className="mt-4">
                  <img
                    src={previewURL || '../../../assets/institution-logo.png'}
                    alt="Imagem instituição"
                    className="w-36 h-36 rounded-full ml-10 mb-2"
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
                      id="logoFile"
                      name="logoFile"
                      hidden
                      type="file"
                      onChange={handleChange}
                      accept="image/*"
                      required
                    />
                  </div>
                </div>
              </label>
            </div>
          </Typography>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button type="button" onClick={closeModal} label="Cancelar" />
          <Button color="blue" type="submit" label="Salvar" disabled={false} />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default InsertImage;
