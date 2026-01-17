import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
    return (
        <div className="flex items-center justify-center min-h-[90vh] w-full">
            <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-gray-600 font-medium">{text}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
