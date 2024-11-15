import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    variant?: "primary" | "secondary" | "alert";
}

export default function Button({
    label,
    onClick,
    icon,
    iconPosition = "left",
    variant = "primary",
    className = "",
}: ButtonProps) {
    const variantClasses = {
    primary: "bg-primary hover:bg-primaryhover",
    secondary: "border-secondary focus:border-secondary focus:ring-1 focus:ring-secondary hover:bg-secondaryhover",
    alert: "bg-alert hover:bg-alerthover text-white",
};
    const classes = variantClasses[variant] || variantClasses.primary;
    
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-center focus:outline-none ${variantClasses} ${classes} ${className}`}
        >
            {icon && iconPosition === "left" && <span className="text-lg">{icon}</span>}
            {label}
            {icon && iconPosition === "right" && <span className="text-lg">{icon}</span>}
        </button>
    );
}
