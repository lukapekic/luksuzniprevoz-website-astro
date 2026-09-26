interface TurnstileApi {
  render(container: HTMLElement, options: {
    sitekey: string;
    action: string;
    theme: "dark" | "light";
    size: "compact" | "normal" | "flexible";
    callback: (token: string) => void;
    "expired-callback": () => void;
    "timeout-callback": () => void;
    "error-callback": () => void;
    "refresh-expired": "auto";
    "refresh-timeout": "auto";
    retry: "auto";
  }): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadApi(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  const pending = new Promise<TurnstileApi>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile-script]');
    const script = existing ?? document.createElement("script");
    const timeout = window.setTimeout(() => reject(new Error("turnstile-timeout")), 10_000);
    const ready = (): void => {
      window.clearTimeout(timeout);
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("turnstile-unavailable"));
    };
    script.addEventListener("load", ready, { once: true });
    script.addEventListener("error", () => reject(new Error("turnstile-load")), { once: true });
    if (!existing) {
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstileScript = "true";
      document.head.append(script);
    }
  }).catch((error: unknown) => {
    scriptPromise = null;
    document.querySelector('script[data-turnstile-script]')?.remove();
    throw error;
  });
  scriptPromise = pending;
  return pending;
}

export interface TurnstileController {
  render: () => Promise<void>;
  getToken: () => string | null;
  reset: () => void;
  destroy: () => void;
}

export function createTurnstileController(input: {
  container: HTMLElement;
  siteKey: string;
  action: string;
  theme?: "dark" | "light";
  size?: "compact" | "normal" | "flexible";
}): TurnstileController {
  let api: TurnstileApi | null = null;
  let widgetId: string | null = null;
  let token: string | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let renderedSize: "compact" | "normal" | "flexible" | null = null;

  const renderWidget = (): void => {
    if (!api) return;
    // Cloudflare's flexible widget has a documented 300 CSS px minimum width.
    const size = input.size === "flexible"
      ? (input.container.clientWidth >= 300 ? "flexible" : "compact")
      : input.size ?? "compact";
    if (widgetId && size === renderedSize) return;
    if (widgetId) api.remove(widgetId);
    token = null;
    renderedSize = size;
    widgetId = api.render(input.container, {
      sitekey: input.siteKey,
      action: input.action,
      theme: input.theme ?? "light",
      size,
      callback: (nextToken) => { token = nextToken; },
      "expired-callback": () => { token = null; },
      "timeout-callback": () => { token = null; },
      "error-callback": () => { token = null; },
      "refresh-expired": "auto",
      "refresh-timeout": "auto",
      retry: "auto",
    });
  };

  return {
    async render() {
      if (widgetId || !input.siteKey) return;
      api = await loadApi();
      renderWidget();
      if (input.size === "flexible") {
        resizeObserver = new ResizeObserver(renderWidget);
        resizeObserver.observe(input.container);
      }
    },
    getToken: () => token,
    reset() {
      token = null;
      if (api && widgetId) api.reset(widgetId);
    },
    destroy() {
      resizeObserver?.disconnect();
      token = null;
      if (api && widgetId) api.remove(widgetId);
      widgetId = null;
    },
  };
}
