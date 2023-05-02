export interface FlayoutConfig {
  direction: string;
  alignment: Alignment;
  gap: string;
}

export interface Alignment {
  x: string;
  y: string;
}

export interface LayoutContent {
  [key: string]: any;
}
