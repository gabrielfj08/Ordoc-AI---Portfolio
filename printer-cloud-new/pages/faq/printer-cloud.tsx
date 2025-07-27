import * as React from 'react';
import Link from 'next/link';
import Topic from './topic';
import { Icon, Typography } from 'printer-ui';

const PrinterCloudFaq = () => {
  return (
    <>
      <div className="flex items-center justify-center sm:justify-start gap-2">
        <Typography variant="title3" family="robotoMedium">
          Printer Cloud
        </Typography>
        <Icon name="cloud" alt="cloud" w={40} h={40} color="blue" stroke />
      </div>
      <div className="h-8 mx-4 sm:mx-0 border-b border-blue" />
      <div className="mt-12 mx-4 space-y-20">
        <Topic title="O que é o Printer Cloud?">
          <Typography variant="headline">
            Plataforma em cloud para gestão de aplicativos, permissões de acesso
            e controle de usuários.
          </Typography>
        </Topic>
        <Topic title="Em quais dispositivos acesso o Printer Cloud?">
          <Typography variant="headline">
            Qualquer dispositivo que possua um navegador e conexão com a
            internet.
          </Typography>
        </Topic>
        <Topic title="Preciso baixar algum aplicativo para acessar o Printer Cloud no celular?">
          <Typography variant="headline">
            Não, o Printer Cloud é acessado através de navegadores já nativos.
          </Typography>
        </Topic>
        <Topic title="Quais são os aplicativos que o Printer Cloud gerencia?">
          <Typography variant="headline">
            Printer Air e Printer Flow.
          </Typography>
        </Topic>
        <Topic title="Como criar uma conta no Printer Cloud?">
          <Typography variant="headline">
            Cada Instituição cria suas próprias contas. Solicite o acesso ao
            responsável definido pela sua instituição.
          </Typography>
        </Topic>
        <Topic title="Não sei ou esqueci meu usuário de acesso ao Printer Cloud. Como devo proceder?">
          <Typography variant="headline">
            Por segurança, não enviamos o nome de usuário por e-mail ou outras
            vias. Solicite ao responsável pela sua instituição.
          </Typography>
        </Topic>
        <Topic title="Por que meu usuário está bloqueado?">
          <Typography variant="headline">
            O bloqueio pode ocorrer após 5 tentativas de login com a senha
            incorreta, ou quando o responsável inativar a conta do usuário. Para
            realizar o desbloqueio, siga o passo a passo informado no tópico
            abaixo, ou entre em contato com o responsável pelo sistema na sua
            instituição.
          </Typography>
        </Topic>
        <Topic title="Como funciona o processo de recuperação/desbloqueio de conta?">
          <ol className="list-decimal pl-5">
            <Typography variant="headline">
              <li>
                Clique no botão de &quot;Recuperar senha&quot; na tela de login;
              </li>
              <li>Informe seu usuário de acesso;</li>
              <li>
                Escolha se deseja receber o código de desbloqueio por SMS ou
                E-mail e clique no botão &quot;Gerar código&quot;;
              </li>
              <li>
                Após receber o código, digite-o no campo indicado e clique em
                &quot;Continuar&quot;;
              </li>
              <li>
                Será solicitado um novo cadastro de senha e, ao finalizar o
                procedimento, sua recuperação ou desbloqueio será concluída com
                sucesso.
              </li>
            </Typography>
          </ol>
        </Topic>
        <Topic title="Como alterar meus dados cadastrais no Printer Cloud?">
          <ol className="list-decimal pl-5">
            <Typography variant="headline">
              <li>
                Faça login no sistema com suas credenciais de usuário e senha;
              </li>
              <li>
                Clique no ícone de perfil localizado no canto superior direito
                da tela e selecione &quot;Editar perfil&quot;;
              </li>
              <li>
                Na página de edição, é possível atualizar seu nome, CPF, Data de
                nascimento, e-mail, telefone e matrícula;
              </li>
              <li>Clique em &quot;salvar&quot;. </li>
            </Typography>
          </ol>
        </Topic>
        <Topic title="Como realizo a abertura de chamado ao suporte sobre o Printer Cloud?">
          <Typography variant="headline">
            Através dos canais de atendimento ao cliente, como o&nbsp;
            <Link href="https://printerdobrasil.com.br/suporte">
              <span className="text-info cursor-pointer underline underline-offset-1">
                site da Printer do Brasil
              </span>
            </Link>
            , ou através do nosso canal no WhatsApp:&nbsp;
            <Link href="https://api.whatsapp.com/send?phone=554184000929&text=%20Ol%C3%A1%2C%20gostaria%20de%20conhecer%20os%20produtos%20Printer%20Cloud.">
              <span className="text-info cursor-pointer underline underline-offset-1">
                (41) 98400-0929.
              </span>
            </Link>
          </Typography>
        </Topic>
        <Topic title="Qual o horário de suporte para o Printer Cloud?">
          <Typography variant="headline">
            O horário de atendimento do suporte técnico é de&nbsp;
            <span className="font-roboto-500">
              segunda a sexta-feira, das 08h às 12h e das 13h às 17h - exceto
              feriados.
            </span>
          </Typography>
        </Topic>
      </div>
    </>
  );
};

export default PrinterCloudFaq;
