import "@testing-library/jest-dom";

// Polyfill Response.redirect for jsdom (used by NextAuth's authorized callback)
if (typeof globalThis.Response !== "undefined" && !globalThis.Response.redirect) {
  globalThis.Response.redirect = function (url: string | URL, status?: number) {
    const response = new Response(null, {
      status: status || 302,
      headers: { location: typeof url === "string" ? url : url.toString() },
    });
    return response;
  };
} else if (typeof globalThis.Response === "undefined") {
  // Minimal Response polyfill for environments where it doesn't exist
  class ResponsePolyfill {
    status: number;
    headers: Map<string, string>;
    body: null;

    constructor(body: null, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new Map(Object.entries(init?.headers || {}));
    }

    static redirect(url: string | URL, status?: number) {
      return new ResponsePolyfill(null, {
        status: status || 302,
        headers: { location: typeof url === "string" ? url : url.toString() },
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Response = ResponsePolyfill;
}
