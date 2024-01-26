export interface ButtonProps {
  background: {
    texture: string;
    frame?: string | number;
  };
  icon?: {
    texture: string;
    frame?: string | number;
    x?: number;
    y?: number;
  };
  nineslice?: {
    width: number;
    height: number;
    corner: number;
  };
  label?: string;
  onRelease?: () => any;
  onReleaseScope?: any;
}
