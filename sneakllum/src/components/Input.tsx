import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    className?: string;
    icon?: React.ReactNode;
    variant?: "primary" | "secondary" | "alert";
}

export default function Input({
    type = "text",
    name,
    placeholder,
    value,
    className = "",
    icon,
    variant = "primary",
    onChange,
}: InputProps) {
    const variantClasses = {
    primary: "bg-primary hover:bg-primaryhover",
    secondary: "border-secondary focus:border-secondary focus:ring-1 focus:ring-secondary hover:bg-secondaryhover",
    alert: "bg-alert text-white",
};
    const classes = variantClasses[variant] || variantClasses.primary;

    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`py-2 px-4 border rounded-lg focus:outline-none ${variantClasses} ${classes} ${className}`}
        >
            {icon && <span className="text-lg">{icon}</span>}
        </input>
    );
}
