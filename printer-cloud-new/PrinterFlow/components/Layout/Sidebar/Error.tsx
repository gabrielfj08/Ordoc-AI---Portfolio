import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const SidebarFlowError = () => {
  return (
    <div className="mt-2 mr-2">
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full" />
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full" />
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full" />
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full" />
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full" />
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full" />
      <div className="flex w-[16.313rem] h-16 items-center gap-4 pl-8 rounded-r-full">
        <Icon name="alert" alt="alert" color="red" stroke />
        <Typography variant="footnote2" family="robotoLight">
          Erro ao carregar menu
        </Typography>
      </div>
    </div>
  );
};

export default SidebarFlowError;
