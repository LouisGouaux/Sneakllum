// Button.tsx
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    variant?: "primary" | "secondary" | "alert";
    noBorder?: boolean;
    noFocusBorder?: boolean;
}

export default function Button({
    label,
    onClick,
    icon,
    iconPosition = "left",
    variant = "primary",
    noBorder = false,
    noFocusBorder = false,
    className = "",
}: ButtonProps) {
    const variantClasses = {
        primary: "bg-primary hover:bg-primaryhover",
        secondary: "border-black hover:bg-secondaryhover",
        alert: "bg-alert hover:bg-alerthover text-white",
    };

    const borderClass = noBorder ? "" : "border";
    const focusClass = noFocusBorder ? "" : "focus:border-secondary focus:ring-1 focus:ring-secondary";
    const backgroundClass = `${variantClasses[variant] || variantClasses.primary} ${noBorder ? "" : ""}`;
    const classes = `${backgroundClass} ${borderClass} ${focusClass} ${className}`;

    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-center focus:outline-none ${classes}`}
        >
            {icon && iconPosition === "left" && <span className="text-lg">{icon}</span>}
            {label}
            {icon && iconPosition === "right" && <span className="text-lg">{icon}</span>}
        </button>
    );
}
