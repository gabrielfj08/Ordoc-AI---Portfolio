import * as React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { Typography } from 'printer-ui';
import { Button } from 'printer-ui';
import AppBar from '../components/AppBar';
import Footer from '../components/Footer';
import Image from 'next/image';

const flowSignaturesUrl =
  getConfig().publicRuntimeConfig.NEXT_PUBLIC_FLOW_URL + '/signatures';

const LandingPage = () => {
  const router = useRouter();

  const goToWhatsApp = () => {
    location.href =
      'https://api.whatsapp.com/send?phone=554184000929&text=%20Ol%C3%A1%2C%20gostaria%20de%20conhecer%20os%20produtos%20Printer%20Cloud.';
  };

  const goToProducts = () => {
    location.href = 'https://printerdobrasil.com.br/produtos-servicos';
  };

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-min-w sm:min-w-max">
      <Head>
        <title>Printer Cloud</title>
      </Head>
      <AppBar onClick={goToTop} />
      <main className="bg-contain bg-no-repeat bg-[url(/assets/cloud-bg-mobile.svg)] sm:bg-[url(/assets/cloud-bg.png)] w-full">
        <div className="mx-[25px]">
          <div className="grid sm:h-[53rem] place-items-center">
            <div className="grid items-center sm:-ml-[120px] mt-[201px] mb-40">
              <div className="sm:space-y-4 sm:-ml-10">
                <Typography
                  variant="largeTitle"
                  family="avenir"
                  className="text-center sm:text-left"
                >
                  Gerenciamento de documentos
                  <br />
                  de maneira fácil e segura
                </Typography>
                <div className="sm:w-[43.75rem]">
                  <Typography
                    variant="body"
                    className="mt-4 text-center text-xs sm:text-left"
                  >
                    Armazenamento, compartilhamento e tramitação de documentos e
                    diretórios a partir de qualquer dispositivo móvel, tablet ou
                    computador.
                  </Typography>
                </div>
                <div className="pt-9 invisible sm:visible">
                  <Button
                    onClick={goToWhatsApp}
                    size="lg"
                    color="info"
                    className="pl-[35px] pr-[35px]"
                    label="Quero Experimentar!"
                  />
                </div>
                <div className="flex justify-center -mt-14 sm:invisible">
                  <Button
                    onClick={goToWhatsApp}
                    size="md"
                    color="info"
                    className="pl-[35px] pr-[35px]"
                    label="Quero Experimentar!"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid place-items-center">
            <Typography
              variant="largeTitle"
              family="avenir"
              className="text-center"
            >
              Aplicativos e serviços disponíveis:
            </Typography>
            <Typography
              variant="body"
              className="mt-4 text-xs text-center sm:w-[49.125rem]"
            >
              Nossos aplicativos trabalham de maneira integrada gerando alto
              rendimento e produtividade no trâmite de processos e documentos
              dentro da sua empresa.
            </Typography>
            <div className="w-80 h-[76px] sm:w-[937px] sm:h-56 mt-14 relative">
              <Image
                src="/assets/apps.svg"
                alt="Printer cloud apps"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="invisible sm:visible sm:-mt-10 z-10">
              <Button
                onClick={goToProducts}
                size="lg"
                color="info"
                className="pl-[35px] pr-[35px] z-10"
                label="Quero Conhecer!"
              />
            </div>
            <div className="sm:invisible sm:-mt-14">
              <Button
                onClick={goToProducts}
                size="md"
                color="info"
                className="pl-[35px] pr-[35px] z-10"
                label="Quero Conhecer!"
              />
            </div>
          </div>

          <div className="sm:invisible sm:absolute">
            <div className="flex items-center justify-center mt-[167px] space-x-2.5">
              <div className="w-5 h-5 mb-1 relative">
                <Image
                  src="/assets/flow-logo.svg"
                  alt="Flow logo"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <Typography variant="largeTitle" family="avenir">
                Flow Signature
              </Typography>
            </div>
            <div className="mt-4 mb-7">
              <Typography variant="footnote1" className="text-center">
                Assine seus documentos eletronicamente através
                <br />
                do nosso aplicativo Printer Flow e verifique se o<br />
                documento assinado eletronicamente é autêntico.
              </Typography>
            </div>
            <div className="flex justify-center">
              <Button
                size="md"
                color="yellow"
                label="Verificador de Assinaturas"
                onClick={() => router.push(flowSignaturesUrl)}
              >
                <Button.Icon
                  alt="flow"
                  name="flow"
                  color="white"
                  stroke
                  h={23}
                  w={23}
                />
              </Button>
            </div>
          </div>

          <div className="mt-40 sm:mt-72 w-full flex-column justify-center">
            <div className="grid justify-center">
              <Typography
                variant="largeTitle"
                family="avenir"
                className="text-center"
              >
                Motivos para usar o Printer Cloud
              </Typography>
              <Typography variant="body" className="mt-4 text-xs text-center">
                Nossa plataforma viabiliza facilidade e dinamicidade nos
                processos internos da sua empresa.
              </Typography>
            </div>

            <div className="grid justify-items-center mt-[90px] sm:mt-32">
              <div className="grid justify-items-center sm:z-10 sm:-ml-[900px] w-[10.125rem] h-[6.75rem] sm:w-[13.813rem] sm:h-[9.25rem] relative">
                <Image
                  src="/assets/landing-page-red.svg"
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="mt-5 sm:mt-0 w-full sm:w-fit grid justify-center sm:-ml-10 sm:absolute">
                <div
                  className="w-[22.5rem] h-[6.25rem] bg-contain bg-no-repeat bg-[url(/assets/border-mobile-red.svg)]
                                sm:bg-[url(/assets/border-red.svg)] sm:w-[53.813rem] sm:h-[6.688rem] sm:flex sm:items-center"
                >
                  <div className="pt-6 sm:pt-0 ml-5 sm:ml-[150px] flex w-[20rem] h-[3.563rem] sm:w-[42.188rem] sm:h-[3.5rem]">
                    <Typography
                      variant="body"
                      className="text-xs text-center sm:text-left"
                    >
                      Adicione facilmente arquivos em nuvem compartilhável tanto
                      dentro da nossa plataforma quanto externamente através de
                      links compartilháveis.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid justify-items-center mt-[90px] sm:mt-[77px]">
              <div className="grid justify-items-center sm:z-10 sm:ml-[1000px] w-[9.625rem] h-[6.25rem] sm:w-[13.188rem] sm:h-[8.563rem] relative">
                <Image
                  src="/assets/landing-page-blue.svg"
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="mt-5 sm:mt-0 w-full sm:w-fit grid justify-center sm:ml-36 sm:absolute">
                <div
                  className="w-[22.5rem] h-[6.25rem] bg-contain bg-no-repeat bg-[url(/assets/border-mobile-blue.svg)]
                                sm:bg-[url(/assets/border-blue.svg)] sm:w-[53.813rem] sm:h-[6.688rem] sm:flex sm:items-center"
                >
                  <div className="pt-6 sm:pt-0 ml-5 sm:ml-[58px] flex w-[20rem] h-[3.563rem] sm:w-[42.188rem] sm:h-[3.5rem]">
                    <Typography
                      variant="body"
                      className="text-xs text-center sm:text-left"
                    >
                      Acesso simples e prático onde quer que você esteja,
                      podendo acessar seus documentos através de dispositivos
                      móveis.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid justify-items-center mt-[90px] sm:mt-[77px]">
              <div className="grid justify-items-center sm:z-10 sm:-ml-[920px] w-[10.938rem] h-[8.063rem] sm:w-[15rem] sm:h-[11rem] relative">
                <Image
                  src="/assets/landing-page-yellow.svg"
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className=""
                />
              </div>
              <div className="mt-5 sm:mt-0 w-full sm:w-fit grid justify-center sm:-ml-10 sm:absolute">
                <div
                  className="w-[22.5rem] h-[6.25rem] bg-contain bg-[url(/assets/border-mobile-yellow.svg)]
                                sm:bg-[url(/assets/border-yellow.svg)] sm:w-[53.813rem] sm:h-[6.688rem] sm:flex sm:items-center"
                >
                  <div className="pt-6 sm:pt-0 ml-5 sm:ml-[150px] flex w-[20rem] h-[3.563rem] sm:w-[42.188rem] sm:h-[3.5rem]">
                    <Typography
                      variant="body"
                      className="text-xs text-center sm:text-left"
                    >
                      Trabalhe com eficiência criando processos, anexando
                      documentos e atribuindo tarefas aos membros da sua equipe.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid justify-items-center mt-[90px] sm:mt-[70px]">
              <div className="grid justify-items-center sm:z-10 sm:ml-[1000px] w-[9.25rem] h-[6.938rem] sm:w-[12.688rem] sm:h-[9.5rem] relative">
                <Image
                  src="/assets/landing-page-green.svg"
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="mt-5 sm:mt-0 w-full sm:w-fit grid justify-center sm:ml-36 sm:absolute">
                <div
                  className="w-[22.5rem] h-[6.25rem] bg-contain bg-no-repeat bg-[url(/assets/border-mobile-green.svg)]
                                sm:bg-[url(/assets/border-green.svg)] sm:w-[53.813rem] sm:h-[6.688rem] sm:flex sm:items-center"
                >
                  <div className="pt-6 sm:pt-0 ml-5 sm:ml-[58px] flex w-[20rem] h-[3.563rem] sm:w-[42.188rem] sm:h-[3.5rem]">
                    <Typography
                      variant="body"
                      className="text-xs text-center sm:text-left"
                    >
                      Implemente a cultura paperless diminuindo gastos ao
                      utilizar a assinatura eletrônica no trâmite de documentos.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid justify-items-center mt-[90px] sm:mt-[82px]">
              <div className="grid justify-items-center sm:z-10 sm:-ml-[900px] w-[9.563rem] h-[6.25rem] sm:w-[13.125rem] sm:h-[8.563rem] relative">
                <Image
                  src="/assets/landing-page-cyan.svg"
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="mt-5 sm:mt-0 w-full sm:w-fit grid justify-center sm:-ml-10 sm:absolute">
                <div
                  className="w-[22.5rem] h-[7.188rem] bg-contain bg-[url(/assets/border-mobile-cyan.svg)]
                                sm:bg-[url(/assets/border-cyan.svg)] sm:w-[53.813rem] sm:h-[7.375rem] sm:flex sm:items-center"
                >
                  <div className="pt-6 sm:pt-0 ml-5 sm:ml-[150px] flex w-[20rem] h-[3.563rem] sm:w-[42.188rem] sm:h-[5.25rem]">
                    <Typography
                      variant="body"
                      className="text-xs text-center sm:text-left"
                    >
                      Sinta-se seguro. Todos os documentos que você fizer upload
                      em nossa plataforma pertencem a você e serão definidos
                      automaticamente como particulares, a menos que você decida
                      compartilhá-los.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid justify-items-center mt-[90px] sm:mt-[75px]">
              <div className="grid justify-items-center sm:z-10 sm:ml-[1000px] w-[8.438rem] h-[6.625rem] sm:w-[11.563rem] sm:h-[9.125rem] relative">
                <Image
                  src="/assets/landing-page-wine.svg"
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="mt-5 sm:mt-0 w-full sm:w-fit grid justify-center sm:ml-36 sm:absolute">
                <div
                  className="w-[22.5rem] h-[7.188rem] bg-contain bg-no-repeat bg-[url(/assets/border-mobile-wine.svg)]
                                sm:bg-[url(/assets/border-wine.svg)] sm:w-[53.813rem] sm:h-[7.375rem] sm:flex sm:items-center"
                >
                  <div className="pt-6 sm:pt-0 ml-5 sm:ml-[58px] flex w-[20rem] h-[3.563rem] sm:w-[42.188rem] sm:h-[5.25rem]">
                    <Typography
                      variant="body"
                      className="text-xs text-center sm:text-left"
                    >
                      Colocamos a segurança em primeiro lugar. Todos os
                      processos, serviços e aplicações de nossa plataforma estão
                      sempre sendo pensados de forma a se adequar aos requisitos
                      da LGPD.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid justify-items-center mt-[90px] sm:mt-[75px]">
              <div className="grid justify-items-center sm:z-10 sm:-ml-[920px] w-[10.5rem] h-[7.125rem] sm:w-[14.375rem] sm:h-[9.75rem] relative">
                <Image
                  src="/assets/landing-page-purple.svg"
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="mt-5 sm:mt-0 w-full sm:w-fit grid justify-center sm:-ml-10 sm:absolute">
                <div
                  className="w-[22.5rem] h-[6.25rem] bg-contain bg-[url(/assets/border-mobile-purple.svg)]
                                sm:bg-[url(/assets/border-purple.svg)] sm:w-[53.813rem] sm:h-[7.375rem] sm:flex sm:items-center"
                >
                  <div className="pt-4 sm:pt-0 ml-5 sm:ml-[150px] flex w-[20rem] h-[3.563rem] sm:w-[41.188rem] sm:h-[5.25rem]">
                    <Typography
                      variant="body"
                      className="text-xs text-center sm:text-left"
                    >
                      Pesquisa eficiente. Ajudamos você a encontrar seus
                      arquivos mais rapidamente reconhecendo textos em
                      documentos digitalizados através da tecnologia OCR.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <div className="flex items-center justify-center my-6 space-x-2">
        <Typography variant="footnote1">
          Todos os direitos reservados para&nbsp;&nbsp;
          <a
            className="text-info underline"
            href="https://printerdobrasil.com.br/"
          >
            Printer do Brasil
          </a>
          .
        </Typography>
      </div>
    </div>
  );
};

export default LandingPage;
