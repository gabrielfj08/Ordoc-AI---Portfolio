import * as React from 'react';
import router from 'next/router';
import { TableV3 as Table, TypographyV3 as Typography } from 'printer-ui';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { ProcedureTableProps } from './types';
import ProcedureTemplateCell from './Cells/ProcedureTemplate';
import ProcessNumberCell from './Cells/ProcessNumber';
import CreatedAtCell from './Cells/CreatedAt';
import MenuProcedureCell from './Cells/Menu';
import StatusCell from './Cells/Status';

const ProcedureTable = ({ data, color }: ProcedureTableProps) => {
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((row) => row, {
      id: 'processNumber',
      header: 'Nº do processo',
      cell: (info) => <ProcessNumberCell procedure={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'procedureTemplateName',
      header: 'Assunto',
      cell: (info) => <ProcedureTemplateCell procedure={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'status',
      header: 'Status',
      cell: (info) => <StatusCell procedure={info.getValue()} />,
    }),

    window.innerWidth < 640
      ? columnHelper.accessor((row) => row, {
          id: 'createdAtMobile',
          header: '',
          cell: (info) => <CreatedAtCell procedure={info.getValue()} />,
        })
      : columnHelper.accessor((row) => row, {
          id: 'createdAt',
          header: () => (
            <div className="sm:flex items-center justify-center">
              <Typography
                color="cidGrayDark"
                variant="bodyMd"
                family="jakartaMedium"
              >
                Criação
              </Typography>
            </div>
          ),
          cell: (info) => <CreatedAtCell procedure={info.getValue()} />,
        }),

    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: '',
      cell: (info) => <MenuProcedureCell procedure={info.getValue()} />,
    }),
  ];

  const handleClick = (procedure) => {
    if (procedure.status === 'draft') {
      if (procedure.payload.length > 0) {
        router.push(
          `/flow-cidadao/procedures/new/${procedure.id}/review-procedure`
        );
      } else {
        router.push(
          `/flow-cidadao/procedures/new/${procedure.id}/complete-procedure`
        );
      }
    } else {
      router.push(`/flow-cidadao/procedures/${procedure.id}`);
    }
  };

  return (
    <Table
      data={data}
      columns={columns}
      color={color}
      onClick={(procedure) => handleClick(procedure)}
    />
  );
};

export default ProcedureTable;
