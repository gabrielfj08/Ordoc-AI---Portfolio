import * as React from 'react';
import Link from 'next/link';
import { Typography } from 'printer-ui';

interface FooterLinkProps {
  children: React.ReactNode;
  href: string;
}

export const FooterLink = ({ children, href }: FooterLinkProps) => {
  return (
    <Typography
      variant="footnote1"
      color="info"
      family="robotoMedium"
      className="underline sm:text-[15px]"
    >
      <Link href={href}>{children}</Link>
    </Typography>
  );
};

const Footer = () => {
  return (
    <footer className="mt-24 pb-7 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-11 sm:justify-center items-center">
      <FooterLink href="https://printerdobrasil.com.br/produtos-servicos">
        Produtos e Serviços
      </FooterLink>
      <FooterLink href="https://printerdobrasil.com.br/contato">
        Contato
      </FooterLink>
      <FooterLink href="https://printerdobrasil.com.br/suporte">
        Suporte
      </FooterLink>
      <FooterLink href="https://printerdobrasil.com.br/politica-de-privacidade">
        Política de Privacidade
      </FooterLink>
      <FooterLink href="/faq">FAQ</FooterLink>
      <FooterLink href="https://printerdobrasil.com.br/politica-de-privacidade">
        Termos de Uso
      </FooterLink>
    </footer>
  );
};

export default Footer;
