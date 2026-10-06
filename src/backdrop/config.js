const savedChunkFilePrefix = "portfolio";

export const shanShuiConfig = Object.freeze({
  seed: "portfolio",
  logicalHeight: 800 / 1.142,
  chunkWidth: 512,
  tileGutter: 32,
  generatorBuffer: 1536,
  savedChunkCount: 12,
  initialChunkCount: 4,
  savedChunkBaseUrl: `/backdrop/chunks/${savedChunkFilePrefix}`,
  savedChunkFilePrefix,
  rasterScale: 1.5,
  motionRampSeconds: 1.6,
});
