import JASSUB from "../jassub/jassub.mjs";

const MOVI_PLAYER_MODULE = "https://cdn.jsdelivr.net/npm/movi-player@0.4.1/dist/element.js";
const CORS_PROXY_URL = "https://cors-proxy.fran-mmagalhaes.workers.dev/fetch";
const JASSUB_ASSETS = new URL("../jassub/", import.meta.url);

class JassubSubtitleRenderer {
  constructor(fonts) {
    this.fonts = fonts;
    this.container = null;
    this.canvas = null;
    this.visibilityStyle = null;
    this.engine = null;
    this.engineReady = false;
    this.scriptHeader = "";
    this.delay = 0;
  }

  mount(container) {
    if (this.container !== container) {
      this.visibilityStyle?.remove();
      this.container?.removeAttribute("data-jassub-renderer");
      this.container = container;
      this.visibilityStyle = document.createElement("style");
      // Movi hides its overlay for the custom renderer; keep the JASSUB canvas visible.
      this.visibilityStyle.textContent =
        ".movi-subtitle-overlay[data-jassub-renderer] { display: flex !important; }";
      container.getRootNode().append(this.visibilityStyle);
      container.setAttribute("data-jassub-renderer", "");
    }
    this.createCanvas();
  }

  createCanvas() {
    this.canvas?.remove();
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    Object.assign(this.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    });
    this.container?.append(this.canvas);
  }

  async configure(track, extradata) {
    await this.destroyEngine();
    if (!this.container) throw new Error("Movi subtitle overlay is unavailable.");

    this.createCanvas();
    this.scriptHeader = new TextDecoder().decode(
      extradata ?? track.extradata ?? new Uint8Array(),
    );
    // JASSUB needs the ASS script header and the font URLs extracted from this MKV.
    const engine = new JASSUB({
      canvas: this.canvas,
      subContent: this.scriptHeader,
      workerUrl: new URL("worker.mjs", JASSUB_ASSETS).href,
      wasmUrl: new URL("jassub-worker.wasm", JASSUB_ASSETS).href,
      modernWasmUrl: new URL("jassub-worker-modern.wasm", JASSUB_ASSETS).href,
      fonts: this.fonts,
    });
    this.engine = engine;
    await engine.ready;
    if (this.engine !== engine) return;
    engine.timeOffset = this.delay;
    this.engineReady = true;
  }

  async pushPacket(packet) {
    const engine = this.engine;
    if (!engine) return;
    await engine.ready;
    if (this.engine !== engine) return;

    // Movi supplies subtitle packets in seconds; JASSUB expects milliseconds.
    await engine.renderer.processChunk(
      new TextDecoder().decode(packet.data),
      Math.round(packet.timestamp * 1000),
      Math.round((packet.duration || 0) * 1000),
    );
  }

  render(mediaTime, videoWidth, videoHeight) {
    const engine = this.engine;
    if (!engine || !this.engineReady || !videoWidth || !videoHeight) return;
    // Render against the video's dimensions so ASS positioning scales with the frame.
    void engine.manualRender({
      expectedDisplayTime: performance.now(),
      width: videoWidth,
      height: videoHeight,
      mediaTime,
    }).catch((error) => console.error("JASSUB render failed", error));
  }

  setDelay(seconds) {
    this.delay = seconds;
    if (this.engine) this.engine.timeOffset = seconds;
  }

  async clear() {
    const engine = this.engine;
    if (!engine || !this.scriptHeader) return;
    await engine.ready;
    await engine.renderer.freeTrack();
    await engine.renderer.setTrack(this.scriptHeader);
  }

  async destroyEngine() {
    const engine = this.engine;
    if (!engine) return;
    this.engine = null;
    this.engineReady = false;
    await engine.destroy();
  }

  async destroy() {
    await this.destroyEngine();
    this.canvas?.remove();
    this.canvas = null;
    this.container?.removeAttribute("data-jassub-renderer");
    this.visibilityStyle?.remove();
    this.container = null;
    this.visibilityStyle = null;
  }
}

function proxiedVideoUrl(videoUrl) {
  const source = new URL(videoUrl);
  if (source.protocol !== "https:") {
    throw new Error("Episode previews require an HTTPS video URL.");
  }

  const proxy = new URL(CORS_PROXY_URL);
  proxy.searchParams.set("url", source.href);
  return proxy.href;
}

async function initializePlayer(root) {
  const player = root.querySelector("movi-player");
  const configNode = root.querySelector("[data-episode-player-config]");
  const config = JSON.parse(configNode.textContent);
  const fontUrls = (config.fonts || []).map((url) => new URL(url, document.baseURI).href);
  const renderer = new JassubSubtitleRenderer(fontUrls);
  let installedCore = null;
  let selectingTrack = false;
  let retrySelection = false;

  player.src = proxiedVideoUrl(config.videoUrl);

  async function selectAssTrack() {
    if (selectingTrack) {
      retrySelection = true;
      return;
    }
    selectingTrack = true;

    try {
      const core = player.player;
      if (!core) return;

      const tracks = core.getSubtitleTracks?.() ?? [];
      const assTracks = tracks.filter((track) =>
        /\b(?:ass|ssa)\b/i.test(`${track.codec || ""} ${track.codecString || ""}`),
      );
      // Prefer a Portuguese ASS track, then fall back to the first ASS/SSA track.
      const track =
        assTracks.find((candidate) =>
          /\b(?:pt|por|portuguese|português)\b/i.test(
            `${candidate.language || ""} ${candidate.label || ""}`,
          ),
        ) || assTracks[0];
      if (!track || installedCore === core) return;

      await core.selectSubtitleTrack(track.id);
      if (player.player !== core) {
        retrySelection = true;
        return;
      }

      player.setSubtitleRenderer(renderer);
      installedCore = core;
    } catch (error) {
      console.error("Could not initialize the JASSUB subtitle track", error);
    } finally {
      selectingTrack = false;
      if (retrySelection) {
        retrySelection = false;
        queueMicrotask(() => void selectAssTrack());
      }
    }
  }

  player.addEventListener("trackschange", () => void selectAssTrack());
  player.addEventListener("loadeddata", () => void selectAssTrack());
  void selectAssTrack();
}

await import(MOVI_PLAYER_MODULE);
await customElements.whenDefined("movi-player");

for (const root of document.querySelectorAll("[data-episode-player-root]")) {
  void initializePlayer(root).catch((error) =>
    console.error("Could not initialize the episode preview", error),
  );
}
