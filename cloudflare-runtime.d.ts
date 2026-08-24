interface D1Result<T = unknown> {
  results: T[];
  success?: boolean;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(sql: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>;
}

interface R2ObjectBody {
  body: ReadableStream;
  size: number;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
}

interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
}

interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

declare module "cloudflare:workers" {
  export const env: {
    DB?: D1Database;
    RESOURCES?: R2Bucket;
    AUTH_SECRET?: string;
    ADMIN_EMAIL?: string;
    ADMIN_PASSWORD_RECORD?: string;
    EMAIL_CRON_SECRET?: string;
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    SITE_URL?: string;
  };
}
