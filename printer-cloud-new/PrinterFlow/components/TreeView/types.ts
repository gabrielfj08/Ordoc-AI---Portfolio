export interface TreeViewContainerProps {
  data: Array<TreeItem>;
}

export interface TreeViewProps {
  data: TreeItem | Array<TreeItem>;
}

export interface TreeItemProps {
  children?: TreeItem | Array<TreeItem>;
  label: string;
  id: number;
  status: string;
}

export interface TreeItem {
  children?: TreeItem | Array<TreeItem>;
  code: string;
  id: number;
  name: string;
  status: string;
}
