import React, { useEffect, useState } from 'react';
import { useNotification } from '@/context/NotificationContext';

const SuccessPopup: React.FC = () => {
    const { dismissTime, onDismiss, successMessage, setSuccessMessage } = useNotification();
    const [show, setShow] = useState(false);

    // State to handle popup dismissal logic
    const [manualDismiss, setManualDismiss] = useState(false);

    useEffect(() => {
        if (successMessage) {
            setShow(true);

            if (!onDismiss) {
                const timer = setTimeout(() => {
                    closePopup();
                }, dismissTime);
                return () => clearTimeout(timer);
            }
        }
    }, [successMessage, dismissTime, onDismiss]);

    const closePopup = () => {
        setShow(false);
        if (onDismiss && !manualDismiss) {
            setManualDismiss(true);
            setTimeout(() => {
                setSuccessMessage(null);
            }, dismissTime);
        } else {
            setSuccessMessage(null);
        }
    };

    return (
        <div
            className={`fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                className={`bg-green-600 text-white p-6 rounded-lg w-[400px] transition-transform duration-300 ${
                    show ? 'transform translate-y-0' : 'transform translate-y-10'
                }`}
            >
                <h2 className="text-xl mb-4">Success</h2>
                <p>{successMessage}</p>
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

export default SuccessPopup;
