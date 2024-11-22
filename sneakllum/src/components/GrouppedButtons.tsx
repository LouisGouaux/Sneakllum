// GrouppedButtons.tsx
import React from "react";
import Button, { ButtonProps } from "./Button";

interface GrouppedButtonsProps {
    children: React.ReactNode;
}

export default function GrouppedButtons({ children }: GrouppedButtonsProps) {
    return (
        <div className="flex items-center space-x-0.5 border border-gray-300 rounded-lg">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === Button) {
                    return React.cloneElement(child as React.ReactElement<ButtonProps>, {
                        noBorder: true,
                        noFocusBorder: true,
                    });
                }
                return child;
            })}
        </div>
    );
}
