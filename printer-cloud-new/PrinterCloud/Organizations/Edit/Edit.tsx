import * as React from 'react';
import router from 'next/router';
import * as Yup from 'yup';
import Head from 'next/head';
import { useFormik } from 'formik';
import { Button, Input, Switch, Typography } from 'printer-ui';
import { useModal, useSnackbar } from '../../../hooks';
import { EditOrganizationProps, EditOrganizationFormValues } from './types';
import AvatarLogo from '../../../components/AvatarLogo';
import InsertImage from '../../../components/Modal/Organization/InsertImage';
import AppList from '../../../components/AppList';
import { noEmojiValidator } from '../../../utils';

const EditOrganization = ({ data, onSubmit }: EditOrganizationProps) => {
  const { openModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues: EditOrganizationFormValues = {
    organization: {
      corporateName: data.corporateName,
      email: data.email,
      phone: data.phone,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      site: data.site,
      logoUrl: data.logoUrl,
      storageLimit: data.storageLimit,
      appIds: data.apps.map((app) => {
        return app.id;
      }),
    },
    address: {
      street: data.address.street,
      number: data.address.number,
      complement: data.address.complement,
      postalCode: data.address.postalCode,
      city: data.address.city,
      state: data.address.state,
      neighborhood: data.address.neighborhood,
    },
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values)
        .then(() => {
          showSnackbar('Instituição atualizada com sucesso', 'success');
          router.push(
            `/printer-cloud/organizations/${router.query.organizationId}`
          );
        })
        .catch((error) => {
          showSnackbar(error.response.data.message, 'error');
        });
    },
    validationSchema: Yup.object().shape({
      organization: Yup.object().shape({
        corporateName: Yup.string()
          .required('Campo obrigatório')
          .test(
            'regex',
            'Não utilize emojis (desenhos ou pictogramas).',
            noEmojiValidator
          ),
        email: Yup.string()
          .email('E-mail válido')
          .required('Campo obrigatório'),
        phone: Yup.string().required('Campo obrigatório'),
        contactName: Yup.string()
          .required('Campo obrigatório')
          .test(
            'regex',
            'Não utilize emojis (desenhos ou pictogramas).',
            noEmojiValidator
          ),
        contactPhone: Yup.string().required('Campo obrigatório'),
      }),
      address: Yup.object().shape({
        street: Yup.string()
          .required('Campo obrigatório')
          .test(
            'regex',
            'Não utilize emojis (desenhos ou pictogramas).',
            noEmojiValidator
          ),
        number: Yup.string().test(
          'regex',
          'Não utilize emojis (desenhos ou pictogramas).',
          noEmojiValidator
        ),
        complement: Yup.string().test(
          'regex',
          'Não utilize emojis (desenhos ou pictogramas).',
          noEmojiValidator
        ),
        postalCode: Yup.string().required('Campo obrigatório'),
        city: Yup.string()
          .required('Campo obrigatório')
          .test(
            'regex',
            'Não utilize emojis (desenhos ou pictogramas).',
            noEmojiValidator
          ),
        state: Yup.string()
          .required('Campo obrigatório')
          .test(
            'regex',
            'Não utilize emojis (desenhos ou pictogramas).',
            noEmojiValidator
          ),
        neighborhood: Yup.string()
          .required('Campo obrigatório')
          .test(
            'regex',
            'Não utilize emojis (desenhos ou pictogramas).',
            noEmojiValidator
          ),
      }),
    }),
  });

  function setAppToggle(arr: any, val: any) {
    return arr.some((arrVal: any) => val === arrVal);
  }

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'Air':
        if (appNames.includes(2)) {
          formik.setFieldValue(
            'organization.appIds',
            formik.values.organization.appIds.filter((appId) => appId !== 2)
          );
        } else {
          formik.setFieldValue(
            'organization.appIds',
            formik.values.organization.appIds.concat(2)
          );
        }
        break;
      case 'Flow':
        if (appNames.includes(3)) {
          formik.setFieldValue(
            'organization.appIds',
            formik.values.organization.appIds.filter((appId) => appId !== 3)
          );
        } else {
          formik.setFieldValue(
            'organization.appIds',
            formik.values.organization.appIds.concat(3)
          );
        }
        break;
      case 'Cloud':
        if (appNames.includes(1)) {
          formik.setFieldValue(
            'organization.appIds',
            formik.values.organization.appIds.filter((appId) => appId !== 1)
          );
        } else {
          formik.setFieldValue(
            'organization.appIds',
            formik.values.organization.appIds.concat(1)
          );
        }
        break;
      default:
        break;
    }
  };

  const [isAirEnabled, setAirEnabling] = React.useState(false);
  const handleAirChange = () => {
    setAirEnabling((current) => !current);
  };

  const [isFlowEnabled, setFlowEnabling] = React.useState(false);
  const handleFlowChange = () => {
    setFlowEnabling((current) => !current);
  };

  const [isCloudEnabled, setCloudEnabling] = React.useState(false);
  const handleCloudChange = () => {
    setCloudEnabling((current) => !current);
  };

  const appNames = formik.values.organization.appIds.map((appId) => {
    return appId;
  });

  React.useEffect(() => {
    setAirEnabling(setAppToggle(appNames, 2));
    setFlowEnabling(setAppToggle(appNames, 3));
    setCloudEnabling(setAppToggle(appNames, 1));
  }, [appNames]);

  const handleSubmit = (s3Url: string) => {
    formik.setFieldValue('organization.logoUrl', s3Url);
  };

  return (
    <>
      <Head>
        <title>Printer Cloud | Editar instituição</title>
      </Head>
      <form
        className="flex-none sm:flex sm:space-x-14 pt-6 sm:pr-20 w-full"
        onSubmit={formik.handleSubmit}
      >
        <div className="sm:w-1/2">
          <div className="flex items-end">
            <div className="pr-7 pl-2 pb-2">
              <AvatarLogo
                onClick={() =>
                  openModal(
                    <InsertImage organization={data} onSubmit={handleSubmit} />
                  )
                }
                src={
                  formik.values.organization.logoUrl ||
                  '../../../assets/institution-logo.png'
                }
              />
            </div>
            <div className="grid space-y-2 pb-2 w-full">
              <Input
                id="organization.corporateName"
                name="organization.corporateName"
                type="text"
                placeholder="Nome da instituição"
                w="auto"
                size="md"
                onChange={formik.handleChange}
                value={formik.values.organization.corporateName}
              />
              {formik.touched.organization?.corporateName &&
              formik.errors.organization?.corporateName ? (
                <Typography variant="footnote2" color="error">
                  *{formik.errors.organization.corporateName}
                </Typography>
              ) : null}
              <Input
                id="organization.cnpj"
                name="organization.cnpj"
                type="cnpj"
                w="auto"
                size="md"
                onChange={() => null}
                value={data.cnpj}
                disabled
              />
            </div>
          </div>
          <div className="grid space-y-2">
            <Input
              id="organization.email"
              name="organization.email"
              type="email"
              placeholder="E-mail"
              w="auto"
              size="md"
              onChange={formik.handleChange}
              value={formik.values.organization.email}
            />
            {formik.touched.organization?.email &&
            formik.errors.organization?.email ? (
              <Typography variant="footnote2" color="error">
                *{formik.errors.organization.email}
              </Typography>
            ) : null}
            <Input
              id="organization.site"
              name="organization.site"
              type="text"
              placeholder="Site"
              w="auto"
              size="md"
              onChange={formik.handleChange}
              value={formik.values.organization.site}
            />
            <Input
              id="organization.phone"
              name="organization.phone"
              type="text"
              placeholder="Telefone"
              w="auto"
              size="md"
              onChange={formik.handleChange}
              value={formik.values.organization.phone}
            />
            {formik.touched.organization?.phone &&
            formik.errors.organization?.phone ? (
              <Typography variant="footnote2" color="error">
                *{formik.errors.organization.phone}
              </Typography>
            ) : null}
            <Input
              id="organization.contactName"
              name="organization.contactName"
              type="text"
              placeholder="Nome do responsável"
              w="auto"
              size="md"
              onChange={formik.handleChange}
              value={formik.values.organization.contactName}
            />
            {formik.touched.organization?.contactName &&
            formik.errors.organization?.contactName ? (
              <Typography variant="footnote2" color="error">
                *{formik.errors.organization.contactName}
              </Typography>
            ) : null}
            <Input
              id="organization.contactPhone"
              name="organization.contactPhone"
              type="text"
              placeholder="Telefone do responsável"
              w="auto"
              size="md"
              onChange={formik.handleChange}
              value={formik.values.organization.contactPhone}
            />
            {formik.touched.organization?.contactName &&
            formik.errors.organization?.contactPhone ? (
              <Typography variant="footnote2" color="error">
                *{formik.errors.organization.contactPhone}
              </Typography>
            ) : null}
          </div>
        </div>
        <div className="flex mt-3 flex-col sm:w-1/2">
          <Input
            id="address.postalCode"
            name="address.postalCode"
            type="cep"
            w="auto"
            size="md"
            onChange={formik.handleChange}
            value={formik.values.address.postalCode}
          />
          {formik.touched.address?.postalCode &&
          formik.errors.address?.postalCode ? (
            <Typography variant="footnote2" color="error">
              *{formik.errors.address.postalCode}
            </Typography>
          ) : null}
          <div className="space-y-2">
            <div className="flex mt-2 space-x-2">
              <div className="w-full">
                <Input
                  id="address.street"
                  name="address.street"
                  type="text"
                  placeholder="Rua"
                  size="md"
                  w="full"
                  className="mr-2"
                  onChange={formik.handleChange}
                  value={formik.values.address.street}
                />
                {formik.touched.address?.street &&
                formik.errors.address?.street ? (
                  <Typography variant="footnote2" color="error">
                    *{formik.errors.address.street}
                  </Typography>
                ) : null}
              </div>
              <div>
                <Input
                  id="address.number"
                  name="address.number"
                  type="text"
                  placeholder="N°"
                  size="md"
                  w={36}
                  onChange={formik.handleChange}
                  value={formik.values.address.number.toString()}
                />
                {formik.touched.address?.number &&
                formik.errors.address?.number ? (
                  <Typography
                    variant="footnote2"
                    color="error"
                    className="w-36"
                  >
                    *{formik.errors.address.number}
                  </Typography>
                ) : null}
              </div>
            </div>
            <div>
              <Input
                id="address.complement"
                name="address.complement"
                type="text"
                placeholder="Complemento"
                w="full"
                size="md"
                onChange={formik.handleChange}
                value={formik.values.address.complement}
              />
              {formik.touched.address?.complement &&
              formik.errors.address?.complement ? (
                <Typography variant="footnote2" color="error">
                  *{formik.errors.address.complement}
                </Typography>
              ) : null}
            </div>
          </div>
          <div className="py-2 space-x-2 flex">
            <div className="w-full">
              <Input
                id="address.neighborhood"
                name="address.neighborhood"
                type="text"
                placeholder="Bairro"
                w="full"
                size="md"
                onChange={formik.handleChange}
                value={formik.values.address.neighborhood}
              />
              {formik.touched.address?.neighborhood &&
              formik.errors.address?.neighborhood ? (
                <Typography variant="footnote2" color="error">
                  *{formik.errors.address.neighborhood}
                </Typography>
              ) : null}
            </div>
            <div className="w-full">
              <Input
                id="address.city"
                name="address.city"
                type="text"
                placeholder="Cidade"
                w="full"
                size="md"
                onChange={formik.handleChange}
                value={formik.values.address.city}
              />
              {formik.touched.address?.city && formik.errors.address?.city ? (
                <Typography variant="footnote2" color="error">
                  *{formik.errors.address.city}
                </Typography>
              ) : null}
            </div>
          </div>
          <Input
            id="address.state"
            name="address.state"
            type="text"
            placeholder="Estado"
            w="auto"
            size="md"
            onChange={formik.handleChange}
            value={formik.values.address.state}
          />
          {formik.touched.address?.state && formik.errors.address?.state ? (
            <Typography variant="footnote2" color="error">
              *{formik.errors.address.state}
            </Typography>
          ) : null}
          <AppList>
            <div className="flex space-x-2 items-center my-4">
              <Typography
                family="robotoBold"
                variant="headline"
                className="pr-6"
              >
                Apps
              </Typography>
              <AppList.Air />
              <div className="w-16">
                <Switch
                  name="Air"
                  checked={appNames.includes(2)}
                  onChange={handleSwitchChange}
                />
              </div>
              <AppList.Cloud />
              <div className="w-16">
                <Switch
                  name="Cloud"
                  checked={appNames.includes(1)}
                  onChange={handleSwitchChange}
                />
              </div>
              <AppList.Flow />
              <div className="w-16">
                <Switch
                  name="Flow"
                  checked={appNames.includes(3)}
                  onChange={handleSwitchChange}
                />
              </div>
            </div>
          </AppList>
          <div className="flex items-center">
            <Typography family="robotoBold" variant="headline" className="pr-6">
              Armanezamento Cloud
            </Typography>
            <Input
              id="organization.storageLimit"
              name="organization.storageLimit"
              type="text"
              placeholder="Tamanho"
              w={48}
              size="md"
              onChange={formik.handleChange}
              value={formik.values.organization.storageLimit}
            />
            <Typography family="roboto" variant="headline" className="pl-2">
              GiB
            </Typography>
          </div>
          <div className="sm:justify-end justify-center flex pt-8">
            <Button
              color="blue"
              size="md"
              type="submit"
              label="Salvar alterações"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default EditOrganization;
