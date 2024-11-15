import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    className?: string;
    variant?: "primary" | "secondary";
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
    type = "text",
    name,
    placeholder,
    value,
    className="",
    variant = "primary",
    onChange,
}: InputProps) {
    const variantClasses =
    variant === "primary"
        ? "border-primary focus:border-primary focus:ring-1 focus:ring-primary hover:bg-primaryhover"
        : "border-secondary focus:border-secondary focus:ring-1 focus:ring-secondary hover:bg-secondaryhover";


    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full border rounded px-4 py-2 focus:outline-none ${variantClasses} ${className}`}
        />
    );
}
