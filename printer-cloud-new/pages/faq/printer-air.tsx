import * as React from 'react';
import Topic from './topic';
import { Icon, Typography } from 'printer-ui';

const PrinterAirFaq = () => {
  return (
    <>
      <div className="flex items-center justify-center sm:justify-start gap-2">
        <Typography variant="title3" family="robotoMedium">
          Printer Air
        </Typography>
        <Icon name="air" alt="air" w={40} h={40} color="red" stroke />
      </div>
      <div className="h-8 mx-4 sm:mx-0 border-b border-red" />
      <div className="mt-12 mx-4 space-y-20">
        <Topic title="O que é o Printer Air?">
          <Typography variant="headline">
            O Printer Air é uma ferramenta de gerenciamento de arquivos em
            nuvem, integrando equipamentos de captura (como scanners e
            multifuncionais) com armazenamento digital e serviço de OCR.
          </Typography>
        </Topic>
        <Topic title="O que é OCR?">
          <Typography variant="headline">
            OCR, do inglês Optical Character Recognition (Reconhecimento Óptico
            de Caracteres) é uma tecnologia que reconhece e extrai os caracteres
            de um arquivo de imagem ou PDF que contém texto.
          </Typography>
        </Topic>
        <Topic title="Por que realizar OCR em documentos?">
          <Typography variant="headline">
            Ao realizar OCR, os documentos tornam-se PDFs pesquisáveis,
            permitindo a busca por conteúdo dentro da plataforma Printer Air.
          </Typography>
        </Topic>
        <Topic title="Como funciona a busca no Printer Air?">
          <Typography variant="headline">
            A busca simples efetua uma varredura nos campos &quot;Nome do
            Documento&quot;, &quot;Descrição&quot;, &quot;Localização&quot; e
            &quot;Conteúdo&quot;. Já na busca avançada, o usuário tem a opção de
            selecionar os campos que deseja procurar, incluindo &quot;Criado
            Por&quot;, &quot;Atualizado Por&quot;, &quot;Datas de Criação&quot;,
            &quot;Data de Atualização&quot;, &quot;Local da Pasta&quot;,
            &quot;Status do Documento&quot;, entre outros.
          </Typography>
        </Topic>
        <Topic title="Como tenho acesso ao Printer Air?">
          <Typography variant="headline">
            Solicite a criação de usuário de acesso ao gestor da sua
            instituição.
          </Typography>
        </Topic>
        <Topic title="Quais tipos de arquivos posso armazenar no Printer Air?">
          <Typography variant="headline">
            Qualquer arquivo que não seja um executável (.exe).
          </Typography>
        </Topic>
        <Topic title="Como posso visualizar arquivos no Printer Air?">
          <Typography variant="headline">
            Arquivos nas extensões PDF, PNG, JPEG, JPG e TIFF são exibidos
            diretamente no navegador, dentro da plataforma. Para visualizar
            arquivos em outras extensões, é necessário realizar o download dos
            mesmos em seu dispositivo.
          </Typography>
        </Topic>
        <Topic title="É possível enviar digitalizações para o Printer Air utilizando multifuncionais e scanners?">
          <Typography variant="headline">
            Sim, por meio de configurações nos equipamentos usando os protocolos
            FTP (File Transfer Protocol) e SFTP (SSH File Transfer Protocol).
            Solicite ao suporte da printer para configurar o seu equipamento.
          </Typography>
        </Topic>
        <Topic title="Posso compartilhar documentos que estão no Printer Air?">
          <Typography variant="headline">
            Sim, é possível compartilhar documentos tanto com usuários da sua
            instituição, por meio da ação &quot;Compartilhar&quot;, quanto com
            usuários externos, por meio de links expiráveis ou permanentes.
          </Typography>
        </Topic>
      </div>
    </>
  );
};

export default PrinterAirFaq;
