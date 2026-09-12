interface TurnstileApi {
  render(container: HTMLElement, options: {
    sitekey: string;
    action: string;
    theme: "dark" | "light";
    size: "compact" | "normal";
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
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
  scriptPromise = new Promise((resolve, reject) => {
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
  });
  return scriptPromise;
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
  action: "contact_submit" | "booking_submit";
  theme?: "dark" | "light";
  size?: "compact" | "normal";
}): TurnstileController {
  let api: TurnstileApi | null = null;
  let widgetId: string | null = null;
  let token: string | null = null;

  return {
    async render() {
      if (widgetId || !input.siteKey) return;
      api = await loadApi();
      widgetId = api.render(input.container, {
        sitekey: input.siteKey,
        action: input.action,
        theme: input.theme ?? "light",
        size: input.size ?? "compact",
        callback: (nextToken) => { token = nextToken; },
        "expired-callback": () => { token = null; },
        "error-callback": () => { token = null; },
      });
    },
    getToken: () => token,
    reset() {
      token = null;
      if (api && widgetId) api.reset(widgetId);
    },
    destroy() {
      token = null;
      if (api && widgetId) api.remove(widgetId);
      widgetId = null;
    },
  };
}
