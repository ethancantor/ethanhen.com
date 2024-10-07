import { useEffect } from "react";

export const useOutsideClick = (ref: React.RefObject<HTMLDivElement> | React.RefObject<HTMLDivElement>[], callback: () => void, open: boolean) => {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            
            let contains;
            if(!Array.isArray(ref)) contains = ref.current?.contains(event.target as Node);
            else contains = ref.reduce((acc, val) => acc || val.current?.contains(event.target as Node) || false, false);
            if (!contains) callback();
        }

        if(open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open, callback, ref])
}