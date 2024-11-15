// components/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
}

export default function Button({ label, onClick, variant = "primary" }: ButtonProps) {
    const baseStyles = "w-full py-2 rounded font-semibold text-center focus:outline-none";
    const variantStyles =
        variant === "primary"
            ? "bg-primary text-secondary hover:bg-primaryhover"
            : "bg-gray-200 text-black hover:bg-gray-300";

    return (
        <button onClick={onClick} className={`${baseStyles} ${variantStyles}`}>
            {label}
        </button>
    );
}
