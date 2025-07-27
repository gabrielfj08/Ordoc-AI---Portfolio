export interface NewGroupRequesterFormProps {
  setOpenInput?: React.Dispatch<React.SetStateAction<boolean>>;
  id: number | null;
  onCancel: () => void;
}
