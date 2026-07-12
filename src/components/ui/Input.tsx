"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Input
 * -----
 * Campo de texto base. Usado em formulários de checklist, cadastro de
 * insumos, registro de ocorrências etc.
 *
 * Variantes:
 * - default → borda neutra, usada na maioria dos formulários
 * - filled  → fundo `muted` sem borda, para formulários densos (ex: filtros de tabela)
 */
const inputVariants = cva(
  [
    "w-full rounded-md text-sm text-foreground",
    "transition-all duration-150 ease-out",
    "placeholder:text-muted-foreground",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "focus:outline-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-surface border border-border shadow-xs",
          "hover:border-ink-300 dark:hover:border-ink-600",
          "focus:border-brand-500 focus:shadow-focus",
        ].join(" "),
        filled: [
          "bg-muted border border-transparent",
          "hover:bg-ink-100 dark:hover:bg-ink-800",
          "focus:bg-surface focus:border-brand-500 focus:shadow-focus",
        ].join(" "),
      },
      inputSize: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-9 px-3",
        lg: "h-10.5 px-3.5 text-base",
      },
      hasError: {
        true: "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgb(214_64_31_/_0.20)]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
      hasError: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Rótulo exibido acima do campo */
  label?: string;
  /** Texto de ajuda exibido abaixo do campo (some quando `error` está presente) */
  helperText?: string;
  /** Mensagem de erro — quando presente, ativa o estado visual de erro */
  error?: string;
  /** Ícone à esquerda, dentro do campo */
  leftIcon?: React.ReactNode;
  /** Ícone à direita, dentro do campo */
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              inputVariants({ variant, inputSize, hasError }),
              leftIcon && "pl-9",
              (rightIcon || hasError) && "pr-9",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {hasError ? (
            <span className="absolute right-3 flex items-center text-danger">
              <AlertCircle className="size-4" aria-hidden="true" />
            </span>
          ) : (
            rightIcon && (
              <span className="absolute right-3 flex items-center text-muted-foreground">
                {rightIcon}
              </span>
            )
          )}
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-danger">
            {error}
          </p>
        ) : (
          helperText && (
            <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-muted-foreground">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
