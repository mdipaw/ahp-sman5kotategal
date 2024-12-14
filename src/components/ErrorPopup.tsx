import React, { useEffect, useState } from 'react';
import { useNotification } from '@/context/NotificationContext';

const ErrorPopup: React.FC = () => {
    const { errorMessage, setErrorMessage } = useNotification();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (errorMessage) {
            setShow(true);
        }
    }, [errorMessage]);

    const closePopup = () => {
        setShow(false);
        setTimeout(() => setErrorMessage(null), 300);
    };

    return (
        <div
            className={`fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                className={`bg-red-600 text-white p-6 rounded-lg w-[400px] transition-transform duration-300 ${
                    show ? 'transform translate-y-0' : 'transform translate-y-10'
                }`}
            >
                <h2 className="text-xl mb-4">Error</h2>
                <p>{errorMessage}</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={closePopup}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPopup;
