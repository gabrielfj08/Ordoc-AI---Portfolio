import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import {
  ShowDirectoryInfoJobAPIResponse,
  showDirectoryInfoJobStatus,
} from '../../../../../services/printer-air/types';
import CreateDirectoryInfoJob from './DirectoryInfoJob';

const directoryStatus: Record<string, showDirectoryInfoJobStatus> = {
  created: 'created',
  finished: 'finished',
  running: 'running',
  failed: 'failed',
};

const ShowDirectoryInfo: ShowDirectoryInfoJobAPIResponse = {
  id: 1,
  status: directoryStatus.finished,
  totalSize: '83,3 MB',
  totalDirectoriesCount: 1,
  totalDocumentsCount: 14,
  directoryId: 7,
  createdById: 4,
  createdAt: '2023-01-16T18:46:10.260Z',
  updatedAt: '2023-01-16T18:46:10.892Z',
};

describe('DirectoryProperties', () => {
  it('renders the created by total size', () => {
    act(() => {
      render(<CreateDirectoryInfoJob directoryInfo={ShowDirectoryInfo} />);
    });

    expect(screen.getByText('83,3 MB')).toBeInTheDocument();
  });
});
