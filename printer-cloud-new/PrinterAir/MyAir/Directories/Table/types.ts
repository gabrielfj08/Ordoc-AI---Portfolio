export interface DirectoriesTableContainerProps {
  organizationId: number;
  parentDirectoryId: number;
  setSelectedDirectoryIds: React.Dispatch<React.SetStateAction<number[]>>;
}
