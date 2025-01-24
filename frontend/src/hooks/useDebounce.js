import { useState, useEffect } from "react";

/**
 * Hook pour créer une valeur "debounced" (retardée).
 * @param {any} value La valeur initiale.
 * @param {number} delay Le délai en millisecondes.
 * @returns {any} La valeur après le délai.
 */
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value); 
        }, delay);

        return () => {
            clearTimeout(handler); 
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
