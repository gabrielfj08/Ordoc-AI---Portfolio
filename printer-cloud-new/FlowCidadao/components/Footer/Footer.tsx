import * as React from 'react';
import Link from 'next/link';
import { Icon, TypographyV3 as Typography } from 'printer-ui';

interface FooterFlowLinkProps {
  children: React.ReactNode;
  href: string;
}

export const FooterLink = ({ children, href }: FooterFlowLinkProps) => {
  return (
    <Typography
      variant="bodySm"
      family="jakartaMedium"
      color="info"
      className="underline sm:text-[15px]"
    >
      <Link legacyBehavior passHref href={href}>
        {children}
      </Link>
    </Typography>
  );
};

const FooterFlowCidadao = () => {
  return (
    <div className="sm:flex items-center py-7 justify-between">
      <div className="sm:flex hidden pl-6 cursor-pointer">
        <Link legacyBehavior passHref href="https://printerdobrasil.com.br">
          <a target="_blank">
            <img src="../../assets/logo-printer-brasil.svg" />
          </a>
        </Link>
      </div>
      <footer className=" flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-11 sm:justify-center items-center">
        <FooterLink href="https://printerdobrasil.com.br/produtos-servicos">
          <a target="_blank">Produtos e Serviços</a>
        </FooterLink>
        <FooterLink href="https://printerdobrasil.com.br/contato">
          <a target="_blank">Contato</a>
        </FooterLink>
        <FooterLink href="https://printerdobrasil.com.br/suporte">
          <a target="_blank">Suporte</a>
        </FooterLink>
        <FooterLink href="https://printerdobrasil.com.br/politica-de-privacidade">
          <a target="_blank">Política de Privacidade</a>
        </FooterLink>
      </footer>
      <div className="flex justify-between sm:pt-0 pt-16">
        <div className="flex sm:hidden pl-3">
          <Link legacyBehavior passHref href="https://printerdobrasil.com.br">
            <a target="_blank">
              <img src="../../assets/logo-printer-brasil.svg" />
            </a>
          </Link>
        </div>
        <div className="flex space-x-2 sm:pr-6 pr-3">
          <Link legacyBehavior passHref href="https://www.printercloud.com.br/">
            <a className="cursor-pointer" target="_blank">
              <Icon
                alt="cloud"
                name="cloud"
                color="white"
                stroke
                bgColor="blue"
                bgStyle="cornerRounded"
                className="rounded-md"
              />
            </a>
          </Link>
          <Link
            legacyBehavior
            passHref
            href="https://printerdobrasil.com.br/produtos-servicos"
          >
            <a className="cursor-pointer" target="_blank">
              <Icon
                alt="air"
                name="air"
                color="white"
                stroke
                bgColor="red"
                bgStyle="cornerRounded"
                className="rounded-md"
              />
            </a>
          </Link>
          <Link legacyBehavior passHref href="https://printerdobrasil.com.br">
            <a className="cursor-pointer" target="_blank">
              <Icon
                alt="flow"
                name="flow"
                color="white"
                stroke
                bgColor="yellow"
                bgStyle="cornerRounded"
                className="rounded-md"
              />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterFlowCidadao;
