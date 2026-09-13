export const lineHeight = {
    fit: 0.8,
    tight: 1,
    snug: 1.1,
    normal: 1.4,
    relaxed: 1.6,
} as const;

export type LineHeight = keyof typeof lineHeight;