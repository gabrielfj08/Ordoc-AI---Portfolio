import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';

export interface InfoProps {
  color: string;
  content?: string;
  title: string;
}

const ProcedureInfo = ({ title, content, color }: InfoProps) => {
  return (
    <div className="flex space-x-1.5 items-center">
      <div className="hidden sm:block">
        <Typography
          variant="bodyLg"
          family="jakartaBold"
          color={color}
          align="start"
        >
          {title}
        </Typography>
      </div>
      <div className="sm:hidden">
        <Typography
          variant="bodyMd"
          family="jakartaBold"
          color={color}
          align="start"
        >
          {title}
        </Typography>
      </div>
      <div className="hidden sm:block">
        <Typography
          variant="bodyLg"
          family="jakarta"
          color="darkGray"
          align="start"
        >
          {content}
        </Typography>
      </div>
      <div className="sm:hidden">
        <Typography
          variant="bodyMd"
          family="jakarta"
          color="darkGray"
          align="start"
        >
          {content}
        </Typography>
      </div>
    </div>
  );
};

export default ProcedureInfo;
