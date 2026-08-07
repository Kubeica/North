"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/components/public/theme/utils";
import { Link } from "@/i18n/navigation";

const publicButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-gold text-primary-foreground hover:bg-gold-light",
        secondary:
          "border border-border bg-surface text-foreground hover:border-gold/40 hover:bg-surface-2",
        ghost: "bg-transparent text-foreground hover:bg-surface",
        outline:
          "border border-border bg-transparent text-foreground hover:border-gold/50 hover:bg-surface/60",
        link: "h-auto rounded-none bg-transparent px-0 text-gold underline-offset-4 hover:text-gold-light hover:underline",
        icon: "border border-transparent bg-transparent text-foreground hover:bg-surface",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-sm",
      },
    },
    compoundVariants: [
      { variant: "icon", size: "sm", class: "size-9 p-0" },
      { variant: "icon", size: "md", class: "size-11 p-0" },
      { variant: "icon", size: "lg", class: "size-12 p-0" },
      { variant: "link", size: "sm", class: "h-auto px-0" },
      { variant: "link", size: "md", class: "h-auto px-0" },
      { variant: "link", size: "lg", class: "h-auto px-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type PublicButtonVariants = VariantProps<typeof publicButtonVariants>;
type LinkHref = ComponentProps<typeof Link>["href"];

type PublicButtonBaseProps = PublicButtonVariants & {
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
  href?: LinkHref;
};

type PublicButtonAsButton = PublicButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof PublicButtonBaseProps> & {
    href?: undefined;
  };

type PublicButtonAsLink = PublicButtonBaseProps &
  Omit<
    ComponentProps<typeof Link>,
    "href" | "className" | "children" | keyof PublicButtonVariants
  > & {
    href: LinkHref;
  };

export type PublicButtonProps = PublicButtonAsButton | PublicButtonAsLink;

export function PublicButton({
  className,
  variant,
  size,
  asChild = false,
  href,
  children,
  ...props
}: PublicButtonProps) {
  const classes = cn(publicButtonVariants({ variant, size }), className);

  if (asChild && isValidElement(children)) {
    const child = Children.only(children) as ReactElement<{
      className?: string;
    }>;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
    });
  }

  if (href !== undefined) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as Omit<ComponentProps<typeof Link>, "href" | "className">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}

/** Thin icon-only wrapper around PublicButton. */
export function IconButton({
  variant = "icon",
  size = "md",
  ...props
}: PublicButtonProps) {
  return <PublicButton variant={variant ?? "icon"} size={size} {...props} />;
}

export { publicButtonVariants };
