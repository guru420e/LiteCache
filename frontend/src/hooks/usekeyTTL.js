import {useEffect} from "react";

export  function useKeyTTL({keys, setKeys}) {
    useEffect(() => {
        const interval = setInterval(() => {
            setKeys((prevKeys) =>
                prevKeys.map((key) => {
                    if (key.ttl > 0) {
                        return {...key, ttl: key.ttl - 1};
                    }
                    return key;
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [keys,setKeys]);
}