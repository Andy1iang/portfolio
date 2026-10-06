export interface ShanShuiConfig {
  readonly seed: string;
  readonly logicalHeight: number;
  readonly chunkWidth: number;
  readonly tileGutter: number;
  readonly generatorBuffer: number;
  readonly savedChunkCount: number;
  readonly initialChunkCount: number;
  readonly savedChunkBaseUrl: string;
  readonly savedChunkFilePrefix: string;
  readonly rasterScale: number;
  readonly motionRampSeconds: number;
}

export const shanShuiConfig: Readonly<ShanShuiConfig>;
