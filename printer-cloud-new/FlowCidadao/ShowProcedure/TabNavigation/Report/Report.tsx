import * as React from 'react';
import { ReportListProps } from './types';
import ReportMessage from './ReportMessages';

const ReportList = ({ justificationNotes, color }: ReportListProps) => {
  return (
    <div className="h-[349px] space-y-4 overflow-x-auto p-2 backdrop-blur-lg">
      {justificationNotes.map((justificationNote) => (
        <div className="p-4">
          <ReportMessage
            color={color}
            action={justificationNote.action}
            createdBy={justificationNote.createdBy.name}
            createdAt={justificationNote.createdAt}
            note={justificationNote.note}
          />
        </div>
      ))}
    </div>
  );
};

export default ReportList;
