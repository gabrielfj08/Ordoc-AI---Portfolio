export interface DrawerContextData {
  openDrawer(DrawerComponent: React.ReactNode, side: drawerSide): void;
  closeDrawer(): void;
}

export interface DrawerProviderProps {
  children: React.ReactNode;
}

export type drawerSide = 'bottom' | 'left' | 'right';

export const justifyMapping: Record<string, string> = {
  bottom: 'items-end',
  left: 'justify-start',
  right: 'justify-end',
};

export const enterFromMapping: Record<string, string> = {
  bottom: 'translate-y-full',
  left: '-translate-x-full',
  right: 'translate-x-full',
};

export const leaveToMapping: Record<string, string> = {
  bottom: 'translate-y-full',
  left: '-translate-x-full',
  right: 'translate-x-full',
};

export const enterToMapping: Record<string, string> = {
  bottom: 'translate-y-0',
  left: '-translate-x-0',
  right: 'translate-x-0',
};

export const leaveFromMapping: Record<string, string> = {
  bottom: 'translate-y-0',
  left: '-translate-x-0',
  right: 'translate-x-0',
};
