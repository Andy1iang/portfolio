export interface ShanShuiPalette {
  background: string;
  ink: string;
  mutedInk: string;
  surface: string;
  blendMode: string;
  filter: string;
  opacity: number;
}

export interface ShanShuiBackdropOptions {
  seed?: string;
  speed?: number;
  aheadTiles?: number;
  behindTiles?: number;
  maxPixelRatio?: number;
  palette?: ShanShuiPalette;
}

export class ShanShuiBackdrop {
  constructor(mount: HTMLElement, options?: ShanShuiBackdropOptions);
  start(): void;
  setSpeed(speed: number): void;
  destroy(): void;
}
