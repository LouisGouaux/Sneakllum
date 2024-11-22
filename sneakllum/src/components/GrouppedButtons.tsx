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
                    // Passons `noBorder` et `noFocusBorder` aux boutons
                    return React.cloneElement(child as React.ReactElement<ButtonProps>, {
                        noBorder: true,   // Pas de bordure sur les boutons dans GroupedButtons
                        noFocusBorder: true,  // Pas de bordure au focus
                    });
                }
                return child;
            })}
        </div>
    );
}
