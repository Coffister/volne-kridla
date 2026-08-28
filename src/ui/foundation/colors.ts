export const colors = {
    background: {
        primary: "var(--color-background-primary)",
    },

    text: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        muted: "var(--color-text-muted)",
        inverse: "var(--color-text-inverse)",
    },

    surface: {
        primary: "var(--color-surface-primary)",
        secondary: "var(--color-surface-secondary)",
        muted: "var(--color-surface-muted)",
        gray: "var(--color-surface-gray)",
    },

    border: {
        primary: "var(--color-border-primary)",
    },

    accent: {
        primary: "var(--color-accent-primary)",
        secondary: "var(--color-accent-secondary)",
    },
} as const;

export type Colors = typeof colors;