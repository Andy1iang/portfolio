import { lightPalette } from "./palette.js";
import { createShanShuiGenerator } from "./shanShuiGenerator.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const LOGICAL_HEIGHT = 800 / 1.142;
const DEFAULT_AHEAD_TILES = 1;
const DEFAULT_BEHIND_TILES = 1;
const TILE_GUTTER = 32;
const GENERATOR_BUFFER = 1536;

export class ShanShuiBackdrop {
  #aheadTiles;
  #animationFrame;
  #behindTiles;
  #canvas;
  #context;
  #cursor = 0;
  #destroyed = false;
  #devicePixelRatio = 1;
  #generator;
  #generationPending = false;
  #idleCallback;
  #lastPlannedTile;
  #mount;
  #palette;
  #previousTime;
  #rasterRevision = 0;
  #resizeObserver;
  #resizeTimer;
  #size = { width: 1, height: 1 };
  #speed;
  #started = false;
  #tiles = new Map();
  #visibleWidth = LOGICAL_HEIGHT;

  constructor(
    mount,
    {
      seed = "portfolio-demo",
      speed = 20,
      aheadTiles = DEFAULT_AHEAD_TILES,
      behindTiles = DEFAULT_BEHIND_TILES,
      maxPixelRatio = 1.5,
      palette = lightPalette,
    } = {},
  ) {
    if (!(mount instanceof HTMLElement)) {
      throw new TypeError("ShanShuiBackdrop requires an HTML mount element.");
    }

    this.#mount = mount;
    this.#speed = speed;
    this.#aheadTiles = Math.max(1, Math.floor(aheadTiles));
    this.#behindTiles = Math.max(0, Math.floor(behindTiles));
    this.#palette = palette;
    this.#devicePixelRatio = Math.min(
      Math.max(window.devicePixelRatio || 1, 1),
      Math.max(maxPixelRatio, 1),
    );
    this.#generator = createShanShuiGenerator({ seed });
    this.#canvas = document.createElement("canvas");
    this.#context = this.#canvas.getContext("2d", { alpha: false });

    if (!this.#context) {
      throw new Error("A 2D canvas context is required for Shan Shui.");
    }
  }

  start() {
    if (this.#started || this.#destroyed) return;

    this.#started = true;
    this.#mount.style.background = this.#palette.background;
    this.#canvas.setAttribute("aria-hidden", "true");
    this.#canvas.style.display = "block";
    this.#canvas.style.width = "100%";
    this.#canvas.style.height = "100%";
    this.#canvas.style.pointerEvents = "none";
    this.#mount.replaceChildren(this.#canvas);

    this.#measure();
    this.#resizeCanvas();
    this.#refreshTilePlan(true);

    this.#resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(this.#resizeTimer);
      this.#resizeTimer = window.setTimeout(() => {
        if (this.#destroyed) return;

        const previousRasterHeight = this.#canvas.height;
        this.#measure();
        this.#resizeCanvas();

        if (this.#canvas.height !== previousRasterHeight) {
          this.#rasterRevision += 1;
          this.#discardAllTiles();
        }

        this.#refreshTilePlan(true);
      }, 150);
    });
    this.#resizeObserver.observe(this.#mount);

    this.#animationFrame = window.requestAnimationFrame(this.#animate);
  }

  setSpeed(speed) {
    if (!Number.isFinite(speed)) {
      throw new TypeError("Shan Shui speed must be a finite number.");
    }

    this.#speed = speed;
    this.#previousTime = undefined;
  }

  destroy() {
    if (this.#destroyed) return;

    this.#destroyed = true;
    window.cancelAnimationFrame(this.#animationFrame);
    window.clearTimeout(this.#resizeTimer);
    this.#cancelIdleWork();
    this.#resizeObserver?.disconnect();
    this.#discardAllTiles();
    this.#mount.replaceChildren();
  }

  #animate = (time) => {
    if (this.#destroyed) return;
    if (this.#previousTime === undefined) this.#previousTime = time;

    const elapsedSeconds = Math.min((time - this.#previousTime) / 1000, 0.1);
    this.#previousTime = time;

    if (!document.hidden && this.#speed !== 0) {
      this.#cursor += this.#speed * elapsedSeconds;
      this.#draw();

      const currentTile = Math.floor(this.#cursor / this.#generator.chunkWidth);
      if (currentTile !== this.#lastPlannedTile) {
        this.#refreshTilePlan();
      }
    }

    this.#animationFrame = window.requestAnimationFrame(this.#animate);
  };

  #measure() {
    const { width, height } = this.#mount.getBoundingClientRect();
    this.#size = {
      width: Math.max(Math.round(width), 1),
      height: Math.max(Math.round(height), 1),
    };
    this.#visibleWidth =
      LOGICAL_HEIGHT * (this.#size.width / this.#size.height);
  }

  #resizeCanvas() {
    this.#canvas.width = Math.ceil(this.#size.width * this.#devicePixelRatio);
    this.#canvas.height = Math.ceil(this.#size.height * this.#devicePixelRatio);
    this.#draw();
  }

  #draw() {
    const context = this.#context;
    const scale = this.#size.height / LOGICAL_HEIGHT;

    context.save();
    context.setTransform(
      this.#devicePixelRatio,
      0,
      0,
      this.#devicePixelRatio,
      0,
      0,
    );
    context.globalCompositeOperation = "source-over";
    context.fillStyle = this.#palette.background;
    context.fillRect(0, 0, this.#size.width, this.#size.height);
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = this.#palette.opacity;

    for (const tile of this.#tiles.values()) {
      const screenX = (tile.logicalStart - this.#cursor) * scale;
      const screenWidth = tile.logicalWidth * scale;

      if (screenX > this.#size.width || screenX + screenWidth < 0) continue;

      context.drawImage(
        tile.image,
        tile.sourceX,
        0,
        tile.sourceWidth,
        tile.image.height,
        screenX,
        0,
        screenWidth + 1,
        this.#size.height,
      );
    }

    context.restore();
  }

  #refreshTilePlan(force = false) {
    const chunkWidth = this.#generator.chunkWidth;
    const firstVisibleTile = Math.floor(this.#cursor / chunkWidth);
    const lastVisibleTile = Math.floor(
      (this.#cursor + this.#visibleWidth) / chunkWidth,
    );

    const planChanged = firstVisibleTile !== this.#lastPlannedTile;
    if (!force && !planChanged) return;
    this.#lastPlannedTile = firstVisibleTile;

    const keepFrom = Math.max(0, firstVisibleTile - this.#behindTiles);
    const keepThrough = lastVisibleTile + this.#aheadTiles;

    if (planChanged) {
      this.#generator.discardOutside(
        keepFrom * chunkWidth - GENERATOR_BUFFER,
        (keepThrough + 1) * chunkWidth + GENERATOR_BUFFER,
      );
    }

    for (const [tileIndex, tile] of this.#tiles) {
      if (tileIndex < keepFrom || tileIndex > keepThrough) {
        tile.image.close?.();
        this.#tiles.delete(tileIndex);
      }
    }

    this.#scheduleNextTile(
      keepFrom,
      keepThrough,
      firstVisibleTile,
      lastVisibleTile,
    );
  }

  #scheduleNextTile(keepFrom, keepThrough, firstVisibleTile, lastVisibleTile) {
    if (this.#generationPending || this.#destroyed) return;

    const priority = [];
    for (let index = firstVisibleTile; index <= lastVisibleTile; index += 1) {
      priority.push(index);
    }
    for (let index = lastVisibleTile + 1; index <= keepThrough; index += 1) {
      priority.push(index);
    }
    for (let index = firstVisibleTile - 1; index >= keepFrom; index -= 1) {
      priority.push(index);
    }

    const nextIndex = priority.find((index) => !this.#tiles.has(index));
    if (nextIndex === undefined) return;

    this.#generationPending = true;
    const rasterRevision = this.#rasterRevision;
    const generate = async () => {
      this.#idleCallback = undefined;

      try {
        const tile = await this.#generateTile(nextIndex);
        if (this.#destroyed || rasterRevision !== this.#rasterRevision) {
          tile.image.close?.();
          return;
        }

        this.#tiles.set(nextIndex, tile);
        this.#draw();
      } finally {
        this.#generationPending = false;
        if (!this.#destroyed) this.#refreshTilePlan(true);
      }
    };

    if ("requestIdleCallback" in window) {
      this.#idleCallback = window.requestIdleCallback(generate, {
        timeout: 1200,
      });
    } else {
      this.#idleCallback = window.setTimeout(generate, 0);
    }
  }

  async #generateTile(tileIndex) {
    const chunkWidth = this.#generator.chunkWidth;
    const tileStart = tileIndex * chunkWidth;
    const tileEnd = tileStart + chunkWidth;
    const rangeStart = Math.max(0, tileStart - TILE_GUTTER);
    const rangeEnd = tileEnd + TILE_GUTTER;
    const logicalWidth = rangeEnd - rangeStart;
    const scale = this.#size.height / LOGICAL_HEIGHT;
    const pixelWidth = Math.max(
      Math.ceil(logicalWidth * scale * this.#devicePixelRatio),
      1,
    );
    const pixelHeight = Math.max(this.#canvas.height, 1);

    // Generate every scene object that could cross this tile before freezing it
    // into a bitmap. Otherwise a wide mountain created for the next tile can
    // appear to stop at an already-rasterized boundary.
    this.#generator.ensureRange(
      Math.max(0, tileStart - GENERATOR_BUFFER),
      tileEnd + GENERATOR_BUFFER,
    );
    const sceneMarkup = this.#generator.renderRange(
      tileStart,
      tileEnd,
      GENERATOR_BUFFER,
    );
    const svg = [
      `<svg xmlns="${SVG_NAMESPACE}"`,
      ` width="${pixelWidth}" height="${pixelHeight}"`,
      ` viewBox="${rangeStart} 0 ${logicalWidth} ${LOGICAL_HEIGHT}"`,
      ` preserveAspectRatio="none">`,
      `<g>${sceneMarkup}</g></svg>`,
    ].join("");

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const image = await rasterizeSvg(
      blob,
      pixelWidth,
      pixelHeight,
      this.#palette,
    );
    return {
      image,
      logicalStart: tileStart,
      logicalWidth: chunkWidth,
      sourceX: ((tileStart - rangeStart) / logicalWidth) * pixelWidth,
      sourceWidth: (chunkWidth / logicalWidth) * pixelWidth,
    };
  }

  #cancelIdleWork() {
    if (this.#idleCallback === undefined) return;

    if ("cancelIdleCallback" in window) {
      window.cancelIdleCallback(this.#idleCallback);
    } else {
      window.clearTimeout(this.#idleCallback);
    }
  }

  #discardAllTiles() {
    for (const tile of this.#tiles.values()) tile.image.close?.();
    this.#tiles.clear();
  }
}

async function rasterizeSvg(blob, pixelWidth, pixelHeight, palette) {
  let source;

  if ("createImageBitmap" in window) {
    try {
      source = await window.createImageBitmap(blob);
    } catch {
      // Fall through for SVG decoders that do not accept SVG blobs directly.
    }
  }

  if (!source) {
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    try {
      image.decoding = "async";
      image.src = objectUrl;
      await image.decode();
      source = image;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  const context = canvas.getContext("2d", { alpha: false });

  if (!context) throw new Error("Unable to rasterize a Shan Shui tile.");
  context.fillStyle = palette.background;
  context.fillRect(0, 0, pixelWidth, pixelHeight);
  context.globalCompositeOperation = palette.blendMode;
  context.drawImage(source, 0, 0, pixelWidth, pixelHeight);
  source.close?.();

  if ("createImageBitmap" in window) {
    return window.createImageBitmap(canvas);
  }

  return canvas;
}
