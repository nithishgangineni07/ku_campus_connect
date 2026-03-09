import React from 'react';

const Input = ({
    label,
    error,
    type = 'text',
    className = '',
    id,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    type={type}
                    className={`block w-full px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow ${error ? 'border-red-500 focus:ring-red-500 dark:border-red-500' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;
