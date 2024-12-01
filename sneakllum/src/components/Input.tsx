import React, { useState, useEffect } from "react";

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
    const [localValue, setLocalValue] = useState(value || "");

    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
        if (onChange) {
            onChange(e);
        }
    };

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
            value={localValue}
            onChange={handleInputChange}
            className={`py-2 px-4 border rounded-lg focus:outline-none ${classes} ${className}`}
        >
            {icon && <span className="text-lg">{icon}</span>}
        </input>
    );
}
