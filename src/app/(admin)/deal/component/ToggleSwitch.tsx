import { useEffect, useState } from "react";

interface Props {
    onChange?: (val: boolean) => void;
}
export default function ToggleSwitch({ onChange }: Props) {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (onChange) onChange(enabled);
    }, [enabled]);
    return (
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${enabled ? "bg-green-500" : "bg-gray-300"
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${enabled ? "translate-x-5" : "translate-x-1"
                    }`}
            />
        </button>
    );
}
