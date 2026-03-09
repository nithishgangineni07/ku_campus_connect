import React from 'react';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
    const variants = {
        default: "bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-lg dark:hover:shadow-slate-900/50 text-gray-900 dark:text-white",
        glass: "glass-card dark:bg-slate-800/80 dark:border-gray-700 text-gray-900 dark:text-white",
        flat: "bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
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
