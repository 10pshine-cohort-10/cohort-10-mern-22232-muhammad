import type { ComponentProps, JSX } from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants, type ButtonVariantProps } from './button-variants';

export interface ButtonProps extends ComponentProps<'button'>, ButtonVariantProps {}

/** Accessible button with design-system variants. Defaults to `type="button"` to avoid accidental form submits. */
export function Button({
  className,
  variant,
  size,
  type = 'button',
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
