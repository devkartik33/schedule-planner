import { useState, useEffect } from "react";

/**
 * Hook для debounce значений
 * @param {any} value - значение для debounce
 * @param {number} delay - задержка в миллисекундах
 * @returns {any} - debounced значение
 */
export function useDebounce(value, delay) {
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
}
