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
    // Classes de base pour les variantes de boutons
    const variantClasses = {
        primary: "bg-primary hover:bg-primaryhover",
        secondary: "bg-secondary hover:bg-secondaryhover",  // Assure-toi que cette classe est définie dans le fichier tailwind.config.js
        alert: "bg-alert hover:bg-alerthover text-white",
    };

    // Suppression de la bordure si noBorder est true
    const borderClass = noBorder ? "" : "border";

    // Classes de focus (si noFocusBorder est true, elles ne sont pas appliquées)
    const focusClass = noFocusBorder ? "" : "focus:border-secondary focus:ring-1 focus:ring-secondary";

    // Si aucune bordure n'est appliquée, alors définir un fond par défaut
    const backgroundClass = noBorder ? "" : variantClasses[variant] || variantClasses.primary;

    // Combine les classes de variante, bordure et focus
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
