import * as React from 'react';
import Link from 'next/link';
import { Button } from 'printer-ui';

const Cookies = (props: any) => {
  return (
    <div className="slideBottom">
      <div className="shadow-lg z-30 fixed bg-white h-48 sm:h-20 rounded-lg items-center sm:flex w-fit sm:w-[1156px] sm:-mt-20 -mt-44 -ml-4 sm:ml-0 mr-4">
        <div className="mx-6 my-4 sm:ml-10 sm:mr-1.5">
          <span className="text-xs sm:text-[15px] align-middle">
            Utilizamos cookies e tecnologias semelhantes para melhorar a sua
            navegação. Ao continuar navegando você concorda com os nossos “
            <Link
              href="https://printerdobrasil.com.br/termo-de-uso"
              legacyBehavior
              passHref
            >
              <a className="text-info underline" target="_blank">
                <span className="text-info underline">Termos de Uso</span>
              </a>
            </Link>{' '}
            e{' '}
            <Link
              href="https://printerdobrasil.com.br/politica-de-privacidade"
              legacyBehavior
              passHref
            >
              <a className="text-info underline" target="_blank">
                <span className="text-info underline">
                  Politica de Privacidade
                </span>
              </a>
            </Link>
            ”
          </span>
        </div>
        <div className="hidden sm:flex sm:ml-12 sm:mr-3">
          <Button
            label="Aceitar"
            color="info"
            size="md"
            onClick={props.onSubmit}
          ></Button>
        </div>
        <div className="sm:hidden mt-6 sm:ml-12 sm:mr-3">
          <Button
            label="Aceitar"
            color="info"
            size="md"
            className="ml-7 w-[303px]"
            onClick={props.onSubmit}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
