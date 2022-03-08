import { useEffect, useState } from 'react';

export const useLocalStorage = <Data extends string | null>({
    key,
}: {
    key: string;
}) => {
    const [value, setValue] = useState<Data>(localStorage.getItem(key) as Data);

    useEffect(() => {
        if (localStorage.getItem(key) !== value) {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        }
    }, [value, key]);

    return {
        value,
        setValue,
    };
};
