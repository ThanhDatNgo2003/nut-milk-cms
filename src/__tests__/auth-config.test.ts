import { authConfig } from "@/lib/auth.config";

describe("authConfig", () => {
  it("has JWT session strategy", () => {
    expect(authConfig.session?.strategy).toBe("jwt");
  });

  it("has 24h max age", () => {
    expect(authConfig.session?.maxAge).toBe(24 * 60 * 60);
  });

  it("has custom sign-in page", () => {
    expect(authConfig.pages?.signIn).toBe("/login");
  });

  it("has trustHost enabled", () => {
    expect(authConfig.trustHost).toBe(true);
  });

  it("has empty providers (added in full auth.ts)", () => {
    expect(authConfig.providers).toEqual([]);
  });

  describe("authorized callback", () => {
    const authorized = authConfig.callbacks?.authorized;

    if (!authorized) {
      throw new Error("authorized callback is not defined");
    }

    it("allows API routes through", async () => {
      const result = await authorized({
        auth: null,
        request: { nextUrl: new URL("http://localhost/api/health") },
      } as Parameters<typeof authorized>[0]);
      expect(result).toBe(true);
    });

    it("redirects unauthenticated users from dashboard to login", async () => {
      const result = await authorized({
        auth: null,
        request: { nextUrl: new URL("http://localhost/") },
      } as Parameters<typeof authorized>[0]);
      expect(result).toBeInstanceOf(Response);
      if (result instanceof Response) {
        expect(result.headers.get("location")).toContain("/login");
      }
    });

    it("redirects authenticated users from login to dashboard", async () => {
      const result = await authorized({
        auth: { user: { id: "1", name: "Test", email: "t@t.com", role: "ADMIN" } },
        request: { nextUrl: new URL("http://localhost/login") },
      } as Parameters<typeof authorized>[0]);
      expect(result).toBeInstanceOf(Response);
      if (result instanceof Response) {
        expect(result.headers.get("location")).toBe("http://localhost/");
      }
    });

    it("allows authenticated users on dashboard", async () => {
      const result = await authorized({
        auth: { user: { id: "1", name: "Test", email: "t@t.com", role: "ADMIN" } },
        request: { nextUrl: new URL("http://localhost/") },
      } as Parameters<typeof authorized>[0]);
      expect(result).toBe(true);
    });
  });
});
