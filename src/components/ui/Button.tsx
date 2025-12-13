/**
 * Button Component
 *
 * Reusable button component with various styles and states
 */

'use client';

import React from 'react';
import { Button as PrimeButton } from 'primereact/button';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'help'
  | 'text'
  | 'link'
  | 'outlined';

export type ButtonSize = 'small' | 'normal' | 'large';

export interface ButtonProps {
  /** Button label text */
  label?: string;
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Icon class name */
  icon?: string;
  /** Icon position */
  iconPos?: 'left' | 'right' | 'top' | 'bottom';
  /** Loading state */
  loading?: boolean;
  /** Loading icon */
  loadingIcon?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Raised style */
  raised?: boolean;
  /** Rounded style */
  rounded?: boolean;
  /** Text style (no background) */
  text?: boolean;
  /** Outlined style */
  outlined?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Badge value */
  badge?: string;
  /** Badge severity */
  badgeSeverity?: 'info' | 'success' | 'warning' | 'danger';
  /** Tooltip text */
  tooltip?: string;
  /** Tooltip position */
  tooltipOptions?: {
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Children elements (for icon-only buttons) */
  children?: React.ReactNode;
}

/**
 * Get PrimeReact severity from variant
 */
const getSeverity = (
  variant: ButtonVariant
): 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help' | undefined => {
  switch (variant) {
    case 'secondary':
      return 'secondary';
    case 'success':
      return 'success';
    case 'danger':
      return 'danger';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    case 'help':
      return 'help';
    default:
      return undefined;
  }
};

export function Button({
  label,
  variant = 'primary',
  size = 'normal',
  icon,
  iconPos = 'left',
  loading = false,
  loadingIcon = 'pi pi-spinner pi-spin',
  disabled = false,
  raised = false,
  rounded = false,
  text = false,
  outlined = false,
  fullWidth = false,
  className = '',
  type = 'button',
  badge,
  badgeSeverity,
  tooltip,
  tooltipOptions,
  onClick,
  children,
}: ButtonProps) {
  const severity = getSeverity(variant);
  const isText = variant === 'text' || text;
  const isOutlined = variant === 'outlined' || outlined;
  const isLink = variant === 'link';

  const sizeClass =
    size === 'small' ? 'p-button-sm' : size === 'large' ? 'p-button-lg' : '';

  return (
    <PrimeButton
      label={label}
      icon={loading ? loadingIcon : icon}
      iconPos={iconPos}
      loading={loading}
      disabled={disabled || loading}
      raised={raised}
      rounded={rounded}
      text={isText}
      outlined={isOutlined}
      link={isLink}
      severity={severity}
      type={type}
      badge={badge}
      tooltip={tooltip}
      tooltipOptions={tooltipOptions}
      onClick={onClick}
      className={`${sizeClass} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </PrimeButton>
  );
}

/**
 * Icon-only button
 */
export function IconButton({
  icon,
  variant = 'text',
  size = 'normal',
  rounded = true,
  className = '',
  ...props
}: Omit<ButtonProps, 'label'> & { icon: string }) {
  return (
    <Button
      icon={icon}
      variant={variant}
      size={size}
      rounded={rounded}
      className={className}
      {...props}
    />
  );
}

export default Button;
