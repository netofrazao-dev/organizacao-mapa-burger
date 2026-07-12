import type { Config } from "tailwindcss";

/**
 * Mapa Burger — Design Tokens
 *
 * Filosofia visual: Notion / Linear / Vercel.
 * Minimalista, denso em informação, alto contraste funcional,
 * zero decoração gratuita. Laranja é usado com MUITA disciplina —
 * reservado para ações primárias, estados ativos e alertas de destaque.
 * Preto/cinza carregam 95% da interface.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Escala de marca — laranja operacional (cor de ação/foco)
        brand: {
          50: "#FFF4ED",
          100: "#FFE6D5",
          200: "#FFC9A8",
          300: "#FFA36D",
          400: "#FF7A33",
          500: "#F4600F", // Primária — botões, links ativos, foco
          600: "#D14D08",
          700: "#A83C08",
          800: "#7F2E0A",
          900: "#5C230A",
          950: "#341206",
        },
        // Escala neutra própria (não é o "gray" default do Tailwind)
        // levemente mais fria, para casar com o laranja quente.
        ink: {
          0: "#FFFFFF",
          50: "#F7F7F8",
          100: "#EEEEF0",
          200: "#DFDFE3",
          300: "#C4C4CB",
          400: "#9A9AA5",
          500: "#71717A",
          600: "#52525B",
          700: "#3A3A41",
          800: "#232327",
          900: "#151517",
          950: "#0A0A0B",
        },
        // Cores semânticas — usadas em badges de status (pedido, estoque, checklist)
        success: { DEFAULT: "#1A8F5C", subtle: "#E6F6EF" },
        warning: { DEFAULT: "#D19A0A", subtle: "#FCF3DA" },
        danger: { DEFAULT: "#D6401F", subtle: "#FBE7E2" },
        info: { DEFAULT: "#2563EB", subtle: "#E8EFFD" },

        // Aliases semânticos que resolvem via CSS var (permitem dark mode automático)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.9375rem", { lineHeight: "1.5rem" }],
        lg: ["1.0625rem", { lineHeight: "1.6rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      spacing: {
        // Escala de 4px consistente com densidade tipo Notion/Linear
        "4.5": "1.125rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        md: "0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
        lg: "0 12px 24px -4px rgb(0 0 0 / 0.10), 0 4px 8px -4px rgb(0 0 0 / 0.06)",
        focus: "0 0 0 3px rgb(244 96 15 / 0.25)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 120ms ease-out",
      },
      transitionDuration: {
        150: "150ms",
      },
    },
  },
  plugins: [],
};

export default config;
