export type Scheme = "light" | "dark";
export declare const SCHEME_EVENT: "ix:scheme";
export declare function normalize(stored: string | null): Scheme | null;
export declare function readScheme(key: string): Scheme | null;
export declare function applyScheme(scheme: Scheme | null): void;
export declare function renderedScheme(key: string, fallback?: Scheme | null): Scheme;
export declare function toggleScheme(key: string, fallback?: Scheme | null): Scheme;
export declare function watchScheme(key: string, fallback?: Scheme | null): () => void;
export declare function bootSnippet(key: string, fallback?: Scheme | null): string;
