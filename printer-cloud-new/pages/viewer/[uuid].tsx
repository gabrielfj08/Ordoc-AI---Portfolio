import * as React from 'react';
import router from 'next/router';
import Image from 'next/image';
import { Typography } from 'printer-ui';
import ShareableLinkPreviewerContainer from '../../PrinterAir/components/ShareableLinkPreviewer';
import Head from 'next/head';

const ViewerPage = () => {
  if (!router.query.uuid) return null;

  return (
    <>
      <nav className="bg-red">
        <div className="h-28 max-w-screen-2xl mx-auto px-6">
          <Image
            src="/../../../assets/printer-air-logo.svg"
            alt="Printer Air Logo"
            width={224}
            height={112}
          />
        </div>
      </nav>
      <Head>
        <title>Printer Air | Visualizar arquivo</title>
      </Head>
      <main className="bg-lighterGray">
        <div className="max-w-screen-2xl mx-auto px-5">
          <Typography className="py-6" variant="title3" align="center">
            Documento compartilhado via Printer Air
          </Typography>
          <div className="w-[80vw] h-[80vh] mx-auto">
            <ShareableLinkPreviewerContainer uuid={String(router.query.uuid)} />
          </div>
        </div>
      </main>
      <footer className="bg-lighterGray">
        <div className="h-28 flex flex-col items-center justify-center gap-4 max-w-screen-2xl mx-auto px-5">
          <div className="flex gap-5">
            <Typography>
              <a
                className="text-blue"
                href="https://printerdobrasil.com.br/produtos-servicos"
                target="_blank"
                rel="noreferrer"
              >
                Produtos e Serviços
              </a>
            </Typography>
            {/* <Typography>
              <a
                className="text-blue"
                href="https://printerdobrasil.com.br/contato"
                target="_blank"
                rel="noreferrer"
              >
                Contato
              </a>
            </Typography> */}
            {/* <Typography>
              <a
                className="text-blue"
                href="https://printerdobrasil.com.br/suporte"
                target="_blank"
                rel="noreferrer"
              >
                Suporte
              </a>
            </Typography> */}
            {/* <Typography>
              <a
                className="text-blue"
                href="https://printerdobrasil.com.br/politica-de-privacidade"
                target="_blank"
                rel="noreferrer"
              >
                Termos de privacidade
              </a>
            </Typography> */}
          </div>
          <Typography>
            Todos os direitos reservados para{' '}
            <a
              className="text-blue"
              href="https://printerdobrasil.com.br"
              target="_blank"
              rel="noreferrer"
            >
              Printer do Brasil
            </a>
          </Typography>
        </div>
      </footer>
    </>
  );
};

export default ViewerPage;
