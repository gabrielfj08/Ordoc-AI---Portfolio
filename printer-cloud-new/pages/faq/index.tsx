import * as React from 'react';
import AppBar from '../../components/AppBar';
import { OptionButton, Typography } from 'printer-ui';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import PrinterCloudFaq from './printer-cloud';
import PrinterAirFaq from './printer-air';
import PrinterFlowFaq from './printer-flow';

const FaqPage = () => {
  const router = useRouter();
  const [app, setApp] = React.useState({
    cloud: true,
    air: false,
    flow: false,
  });

  const handleCloudClick = () => {
    setApp({ cloud: true, air: false, flow: false });
  };

  const handleAirClick = () => {
    setApp({ cloud: false, air: true, flow: false });
  };

  const handleFlowClick = () => {
    setApp({ cloud: false, air: false, flow: true });
  };

  return (
    <>
      <Head>
        <title>Printer Cloud | FAQ</title>
      </Head>
      <AppBar onClick={() => router.push('./')} />
      <div className="w-full sm:px-8 xl:px-44 sm:pt-28 pt-20 items-center flex flex-col justify-center">
        <Typography
          className="mt-7 sm:mt-16"
          variant="title5"
          family="robotoMedium"
        >
          <span className="mr-1.5">F.</span>A.Q.
        </Typography>
        <Typography variant="headline" family="robotoMedium">
          Sobre nossos sistemas e serviços
        </Typography>
        <div className="w-full sm:flex mt-16 space-y-20 sm:space-y-0 sm:space-x-12">
          <div className="sm:w-4/12 lg:w-3/12">
            <div className="space-y-5 flex flex-col items-center justify-center">
              <Typography variant="title2" align="center" family="robotoMedium">
                Sobre qual app é sua dúvida?
              </Typography>
              <OptionButton
                h={16}
                checked={app.cloud}
                onClick={handleCloudClick}
                type="radio"
                bgColorChildren="blue"
                label="Printer Cloud"
              >
                <OptionButton.Icon name="cloud" color="white" stroke />
              </OptionButton>
              <OptionButton
                h={16}
                checked={app.air}
                onClick={handleAirClick}
                type="radio"
                bgColorChildren="red"
                label="Printer Air"
              >
                <OptionButton.Icon name="air" color="white" stroke />
              </OptionButton>
              <OptionButton
                h={16}
                checked={app.flow}
                onClick={handleFlowClick}
                type="radio"
                bgColorChildren="yellow"
                label="Printer Flow"
              >
                <OptionButton.Icon name="flow" color="white" stroke />
              </OptionButton>
            </div>
          </div>
          <div className="sm:w-8/12 lg:w-9/12">
            {app.cloud && <PrinterCloudFaq />}
            {app.air && <PrinterAirFaq />}
            {app.flow && <PrinterFlowFaq />}
          </div>
        </div>
        <Footer />
        <div className="flex items-center justify-center mb-6 space-x-2">
          <Typography variant="footnote1">
            Todos os direitos reservados para&nbsp;&nbsp;
            <Link href="https://printerdobrasil.com.br/">
              <span className="text-info underline cursor-pointer">
                Printer do Brasil
              </span>
            </Link>
          </Typography>
        </div>
      </div>
    </>
  );
};

export default FaqPage;
