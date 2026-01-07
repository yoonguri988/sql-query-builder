export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onLeftSidebarToggle: () => void;
  onRightPanelToggle: () => void;
}

export interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface RightPanelProps {
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
}

export interface MainContentProps {
  isRightPanelOpen: boolean;
}
