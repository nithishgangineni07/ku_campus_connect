import React from 'react';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
    const variants = {
        default: "bg-white border border-gray-100 shadow-md hover:shadow-lg",
        glass: "glass-card",
        flat: "bg-gray-50 border border-gray-200"
    };

    return (
        <div
            className={`rounded-xl overflow-hidden transition-all duration-300 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
