export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  onLeftSidebarToggle: () => void;
  onRightPanelToggle: () => void;
}

export interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MainContentProps {
  isRightPanelOpen: boolean;
}
