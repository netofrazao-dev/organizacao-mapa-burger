"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button
 * ------
 * Componente base de ação da plataforma. Usado em toda a área de gestão
 * (confirmar checklist, registrar ocorrência, salvar item de estoque etc).
 *
 * Variantes:
 * - primary   → ação principal da tela (laranja sólido, usar no máx. 1 por seção)
 * - secondary → ação de apoio (preto/ink sólido)
 * - outline   → ação secundária com hierarquia mais baixa
 * - ghost     → ação terciária, dentro de listas/tabelas/toolbars
 * - danger    → ações destrutivas (excluir, cancelar pedido)
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium",
    "transition-all duration-150 ease-out",
    "disabled:pointer-events-none disabled:opacity-45",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-brand-500 text-white shadow-xs",
          "hover:bg-brand-600 hover:shadow-sm",
          "focus-visible:shadow-focus",
        ].join(" "),
        secondary: [
          "bg-ink-900 text-white shadow-xs",
          "hover:bg-ink-800",
          "dark:bg-ink-100 dark:text-ink-950 dark:hover:bg-white",
          "focus-visible:shadow-focus",
        ].join(" "),
        outline: [
          "border border-border bg-surface text-foreground shadow-xs",
          "hover:bg-muted hover:border-ink-300 dark:hover:border-ink-600",
          "focus-visible:shadow-focus",
        ].join(" "),
        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-muted",
          "focus-visible:shadow-focus",
        ].join(" "),
        danger: [
          "bg-danger text-white shadow-xs",
          "hover:brightness-95",
          "focus-visible:shadow-focus",
        ].join(" "),
      },
      size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-9 px-3.5",
        lg: "h-10.5 px-5 text-base",
        icon: "h-9 w-9 shrink-0 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Mostra spinner e desabilita o botão — usar durante submits assíncronos */
  isLoading?: boolean;
  /** Ícone à esquerda do label (ex: <Plus size={16} />) */
  leftIcon?: React.ReactNode;
  /** Ícone à direita do label */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
