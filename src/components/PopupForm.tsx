import React, {useEffect, useState} from 'react';

type PopupFormProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: string[]) => void;
    inputs: { label: string; defaultValue: string; disabled?: boolean; }[];
};

const PopupForm: React.FC<PopupFormProps> = ({title, isOpen, onClose, onSubmit, inputs }) => {
    const [inputValues, setInputValues] = useState<string[]>(
        inputs.map(input => input.defaultValue)
    );

    useEffect(() => {
        setInputValues(inputs.map(input => input.defaultValue));
    }, [isOpen, inputs]);

    const handleInputChange = (index: number, value: string) => {
        const updatedValues = [...inputValues];
        updatedValues[index] = value;
        setInputValues(updatedValues);
    };


    const handleSubmit = () => {
        onSubmit(inputValues);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-[400px]">
                <h2 className="text-xl mb-4">{title}</h2>
                <div className="space-y-4">
                    {inputs.map((input, index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium text-gray-700">{input.label}</label>
                            <input
                                type="text"
                                value={inputValues[index]}
                                disabled={input.disabled}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-400 disabled:text-gray-600 disabled:border-gray-400"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupForm;
