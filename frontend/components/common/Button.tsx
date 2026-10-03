"use client";

import BootstrapButton, { type ButtonProps as BootstrapButtonProps } from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export interface ButtonProps extends BootstrapButtonProps {
  /** Shows a spinner, disables the button and announces the busy state. */
  loading?: boolean;
  /** Bootstrap Icons class shown before the label, e.g. "bi-plus-lg" */
  icon?: string;
}

export default function Button({ loading = false, icon, disabled, children, ...props }: ButtonProps) {
  return (
    <BootstrapButton {...props} disabled={disabled || loading} aria-busy={loading || undefined}>
      {loading ? (
        <Spinner as="span" animation="border" size="sm" className="me-2" aria-hidden="true" />
      ) : (
        icon && <i className={`bi ${icon} me-2`} aria-hidden="true" />
      )}
      {children}
    </BootstrapButton>
  );
}
