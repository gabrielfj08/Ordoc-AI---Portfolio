import * as React from 'react';
import Topic from './topic';
import { Icon, Typography } from 'printer-ui';

const PrinterFlowFaq = () => {
  return (
    <>
      <div className="flex items-center justify-center sm:justify-start gap-2">
        <Typography variant="title3" family="robotoMedium">
          Printer Flow
        </Typography>
        <Icon name="flow" alt="flow" w={40} h={40} color="yellow" stroke />
      </div>
      <div className="h-8 mx-4 sm:mx-0 border-b border-red" />
      <div className="mt-12 mx-4 space-y-20">
        <Topic title="O que é o Printer Flow?">
          <Typography variant="headline">
            É uma ferramenta que permite a criação, acompanhamento e assinatura
            eletrônica de documentos. É uma sofisticada ferramenta de tramitação
            digital em nuvem.
          </Typography>
        </Topic>
        <Topic title="Qual é o diferencial do Printer Flow?">
          <Typography variant="headline">
            Crie campos personalizados: É possível a criação de campos
            específicos, tais como campo curto, campo longo, campo de data,
            campo de anexos, entre outros.
            <br /> Execute tarefas simultâneas: O usuário pode criar diversos
            tipos de tarefas sem perder acesso ao processo.
            <br /> Integração com o Printer Air: Facilitando o armazenamento de
            todo o conteúdo adicionado à solicitação.
          </Typography>
        </Topic>
        <Topic title="Qual é vantagem de armazenar tramitações do Printer Flow  no Printer Air?">
          <Typography variant="headline">
            Todos os documentos submetidos à plataforma podem ser processados
            por OCR, permitindo que sejam facilmente pesquisados por conteúdo
            após o processamento. Além disso, são armazenados em nuvem com
            organização estruturada, criando pastas específicas para cada tipo
            de tramitação e numeração.
          </Typography>
        </Topic>
        <Topic title="Quais são os acessos no Printer Flow?">
          <Typography variant="headline">
            Edição: Com permissão para criar grupos, solicitantes e tipos de
            processos.
            <br />
            Visualização: Sem poder de editar, somente acompanhar. <br />
            Cabe à instituição decidir entre usar essas permissões padrão ou
            criar outras personalizadas.
          </Typography>
        </Topic>
        <Topic title="É possível criar o organograma no Printer Flow?">
          <Typography variant="headline">
            Sim, no flow chamamos de Grupos. O usuário interno, com a permissão
            correta, pode criar, visualizar e adicionar solicitantes dentro de
            cada grupo.
          </Typography>
        </Topic>
        <Topic title="O que são solicitantes?">
          <Typography variant="headline">
            Solicitantes são todos que podem participar de um tramitação, sendo
            interno ou externo, podendo ser: pessoas, empresas ou departamentos.
          </Typography>
        </Topic>
        <Topic title="O que são os tipos de processo?">
          <Typography variant="headline">
            São modelos de processos com campos personalizados pré-definidos.
            Estão entre as solicitações mais recorrentes, que se aplicam a
            diversos tipos de tramitação, seja para solicitar uma compra ou um
            período de férias. É possível incluir campos obrigatórios ao
            processo para simplificar a criação do requerimento, deixando a
            seleção dos campos a cargo do usuário interno.
          </Typography>
        </Topic>
      </div>
    </>
  );
};

export default PrinterFlowFaq;
