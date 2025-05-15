import { useState, useEffect } from "react";

const CalendarLoader = ({
    operation = "Updating",
    isLoading = true,
    onComplete = () => { },
    eventTitle = ""
}) => {
    const [dots, setDots] = useState("");

    // Animate the dots
    useEffect(() => {
        if (!isLoading) {
            onComplete();
            return;
        }

        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === "...") return "";
                return prev + ".";
            });
        }, 500);

        return () => clearInterval(interval);
    }, [isLoading, onComplete]);

    const operationMessage = operation;

    if (!isLoading) {
        return null;
    }

    return (
        <div className="fixed top-170 left-150 z-1 bg-white rounded-4xl pl-4 py-2 border border-zinc-300">
            <span className="text-coral">{eventTitle}</span>
            <span className="text-zinc-600">{"  " + operationMessage}</span>
            <span className="inline-block w-8">{dots}</span>
        </div>
    );
};

export default CalendarLoader;