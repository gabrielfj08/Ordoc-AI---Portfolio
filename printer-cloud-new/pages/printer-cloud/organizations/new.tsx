import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, ButtonRounded, Icon, Input, Typography } from 'printer-ui';
import { OrganizationService, CepPromise } from '../../../services';
import { useAuth, useSnackbar } from '../../../hooks';
import { getSubdomain } from '../../../utils';
import Layout, { Header } from '../../../components/Layout';

const NewOrganizationPage = () => {
  const { token } = useAuth();

  const { showSnackbar } = useSnackbar();
  const [isLoading, setLoading] = React.useState(false);
  const [logoFile] = React.useState();
  const router = useRouter();

  React.useEffect(() => {
    if (logoFile) formik.setFieldValue('logo', URL.createObjectURL(logoFile));
  }, [logoFile]);

  const loading = () => {
    setLoading(true);
  };

  const loaded = () => {
    setLoading(false);
  };

  const handleSubmit = (s3Url: string) => {
    formik.setFieldValue('logoUrl', s3Url);
  };

  const fetchCep = (cep: string) => {
    CepPromise.get(cep).then((result) => {
      formik.setFieldValue('street', result.data.street);
      formik.setFieldValue('city', result.data.city);
      formik.setFieldValue('neighborhood', result.data.neighborhood);
      formik.setFieldValue('state', result.data.state);
    });
  };

  const formik = useFormik({
    initialValues: {
      corporate_name: '',
      cnpj: '',
      email: '',
      site: '',
      phone: '',
      contact_name: '',
      logo: '../../assets/institution-logo.png',
      contact_phone: '',
      postal_code: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
    validationSchema: Yup.object().shape({
      corporate_name: Yup.string().required('Campo obrigatório'),
      cnpj: Yup.string().required('Campo obrigatório'),
      email: Yup.string().email('E-mail válido').required('Campo obrigatório'),
      phone: Yup.string()
        .min(13, 'Telefone inválido.')
        .max(14, 'Telefone inválido.')
        .required('Campo obrigatório'),
      contact_name: Yup.string().required('Campo obrigatório'),
      contact_phone: Yup.string()
        .min(13, 'Telefone inválido')
        .max(14, 'Telefone inválido')
        .required('Campo obrigatório'),
      postal_code: Yup.string().required('Campo obrigatório'),
    }),
    onSubmit: (values) => {
      loading();
      OrganizationService.create(token, getSubdomain(), values)
        .then((res) => {
          loaded();
          router.push(`/printer-cloud/organizations`);
          if (res.status === 201) {
            showSnackbar(
              `Instituição ${values.corporate_name} adicionada com sucesso`,
              'success'
            );
          }
        })
        .catch((err) => {
          loaded();
          if (err.response.status === 500) {
            showSnackbar(
              'Um erro inesperado ocorreu, tente novamente.',
              'error'
            );
          } else {
            showSnackbar(`${err.response.data.message}`, 'error');
          }
        });
    },
  });

  return (
    <Layout>
      <Head>
        <title>Printer Cloud | Nova instituição</title>
      </Head>
      <Header>
        <div className="sm:pl-4 sm:pr-4 pt-4 sm:pt-0">
          <Link href="/printer-cloud/organizations">
            <ButtonRounded onClick={() => null}>
              <Icon
                alt="return"
                name="return"
                w={30}
                h={30}
                color="gray"
                fill
                stroke
              ></Icon>
            </ButtonRounded>
          </Link>
        </div>
        <div className="pt-4 pl-2 sm:pt-0">
          <Typography family="robotoBold" variant="title3">
            Nova instituição
          </Typography>
        </div>
      </Header>
      <div className="pt-6 w-fit flex-none sm:flex">
        <main className="flex-none sm:flex">
          <form
            className="flex-none sm:flex sm:space-x-14"
            onSubmit={formik.handleSubmit}
          >
            <div className="w-[29.5rem]">
              <div className="flex items-end">
                {/* <div className="pr-4 pl-2 pb-2">
                    <AvatarLogo
                      onClick={insertLogo}
                      src={formik.values.logo}
                    ></AvatarLogo>
                  </div> */}
                <div className="grid space-y-2 pb-2 w-full">
                  <Input
                    id="corporate_name"
                    name="corporate_name"
                    type="text"
                    placeholder="Nome da instituição"
                    w="auto"
                    size="md"
                    onChange={formik.handleChange}
                    value={formik.values.corporate_name}
                  />
                  {formik.touched.corporate_name &&
                  formik.errors.corporate_name ? (
                    <Typography variant="footnote2" color="error">
                      *{formik.errors.corporate_name}
                    </Typography>
                  ) : null}
                  <Input
                    id="cnpj"
                    name="cnpj"
                    type="cnpj"
                    w="auto"
                    size="md"
                    onChange={formik.handleChange}
                    value={formik.values.cnpj}
                  />
                  {formik.touched.cnpj && formik.errors.cnpj ? (
                    <Typography variant="footnote2" color="error">
                      *{formik.errors.cnpj}
                    </Typography>
                  ) : null}
                </div>
              </div>
              <div className="grid space-y-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  w="auto"
                  size="md"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <Typography variant="footnote2" color="error">
                    *{formik.errors.email}
                  </Typography>
                ) : null}
                <Input
                  id="site"
                  name="site"
                  type="text"
                  placeholder="Site"
                  w="auto"
                  size="md"
                  onChange={formik.handleChange}
                  value={formik.values.site}
                />
                <Input
                  id="phone"
                  name="phone"
                  type="phone"
                  placeholder="Telefone da instituição"
                  w="auto"
                  size="md"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <Typography variant="footnote2" color="error">
                    *{formik.errors.phone}
                  </Typography>
                ) : null}
                <Input
                  id="contact_name"
                  name="contact_name"
                  type="text"
                  placeholder="Nome do responsável"
                  w="auto"
                  size="md"
                  onChange={formik.handleChange}
                  value={formik.values.contact_name}
                />
                {formik.touched.contact_name && formik.errors.contact_name ? (
                  <Typography variant="footnote2" color="error">
                    *{formik.errors.contact_name}
                  </Typography>
                ) : null}
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  type="phone"
                  placeholder="Telefone do responsável"
                  w="auto"
                  size="md"
                  onChange={formik.handleChange}
                  value={formik.values.contact_phone}
                />
                {formik.touched.contact_phone && formik.errors.contact_phone ? (
                  <Typography variant="footnote2" color="error">
                    *{formik.errors.contact_phone}
                  </Typography>
                ) : null}
              </div>
            </div>
            <div className="flex mt-3 flex-col w-[29.5rem]">
              <Input
                id="postal_code"
                name="postal_code"
                type="cep"
                w="auto"
                size="md"
                onChange={formik.handleChange}
                value={formik.values.postal_code}
                onBlur={() => fetchCep(formik.values.postal_code)}
              />
              {formik.touched.postal_code && formik.errors.postal_code ? (
                <Typography variant="footnote2" color="error">
                  *{formik.errors.postal_code}
                </Typography>
              ) : null}
              <div className="pb-2">
                <div className="space-y-2 grid-col w-full">
                  <Input
                    id="street"
                    name="street"
                    type="text"
                    placeholder="Rua"
                    size="md"
                    w={80}
                    className="mr-2"
                    onChange={formik.handleChange}
                    value={formik.values.street}
                  />
                  <Input
                    id="number"
                    name="number"
                    type="text"
                    placeholder="N°"
                    size="md"
                    w={36}
                    onChange={formik.handleChange}
                    value={formik.values.number}
                  />
                  <Input
                    id="complement"
                    name="complement"
                    type="text"
                    placeholder="Complemento"
                    w="full"
                    size="md"
                    onChange={formik.handleChange}
                    value={formik.values.complement}
                  />
                </div>
                <div className="pt-2 space-x-2 flex">
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    type="text"
                    placeholder="Bairro"
                    w={72}
                    size="md"
                    onChange={formik.handleChange}
                    value={formik.values.neighborhood}
                  />
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Cidade"
                    w={52}
                    size="md"
                    onChange={formik.handleChange}
                    value={formik.values.city}
                  />
                </div>
              </div>
              <Input
                id="state"
                name="state"
                type="text"
                placeholder="Estado"
                w="auto"
                size="md"
                onChange={formik.handleChange}
                value={formik.values.state}
              />
              <div className="sm:justify-end justify-center flex pt-12">
                <Button
                  color="blue"
                  size="md"
                  type="submit"
                  disabled={isLoading}
                  label="Criar instituição"
                ></Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
};

export default NewOrganizationPage;
