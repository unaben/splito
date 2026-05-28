import { useState } from "react";

function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;

      try {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error saving to sessionStorage:", error.message);
        }
      }

      return valueToStore;
    });
  };

  return [storedValue, setValue];
}

export default useSessionStorage;
