export interface DirectoriesContainerProps {
  organizationId: number;
  directoryId: number;
  setSelectedDirectoryIds: React.Dispatch<React.SetStateAction<number[]>>;
}
