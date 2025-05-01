import clsx from "clsx";
import { forwardRef, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  color?: "default" | "white" | "outline";
  size?: "default" | "sm" | "md" | "lg" | "xl";
  rounded?: "default" | "sm" | "md" | "lg" | "xl" | "none";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      color = "default",
      size = "default",
      rounded = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const colors = {
      default: "bg-blue-600 hover:bg-blue-800",
      white: "hover:bg-gray-200 text-gray-900",
      outline: "hover:bg-gray-200 text-gray-900 border border-gray-200",
    };

    const sizes = {
      sm: "p-1",
      md: "p-2",
      default: "py-2 px-4",
      lg: "p-4",
      xl: "p-5",
    };

    const rounds = {
      sm: "rounded-md",
      md: "rounded-md",
      default: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      none: "",
    };

    return (
      <button
        ref={ref}
        className={clsx(colors[color], sizes[size], rounds[rounded], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
