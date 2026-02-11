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

/** 반응형 관련 타입 */
export type Breakpoint = "mobile" | "tablet" | "desktop";

export interface ResponsiveConfig {
  mobile: {
    maxWidth: number;
    columns: number;
  };
  tablet: {
    minWidth: number;
    maxWidth: number;
    columns: number;
  };
  desktop: {
    minWidth: number;
    columns: number;
  };
}

export interface SwipeGestureConfig {
  threshold: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}
