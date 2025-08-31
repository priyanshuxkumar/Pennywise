import React from 'react';

interface ButtonProps {
    content: React.ReactNode | string;
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    className = '',
    content,
    onClick,
    type = 'button',
    disabled = false,
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white ${className}`}
            {...props}
        >
            {content}
        </button>
    );
};
