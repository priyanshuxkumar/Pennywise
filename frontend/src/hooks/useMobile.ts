import { useEffect, useState } from "react";

export const useMediaQuery = (): boolean => {
    const isMobileOrTabletMediaQuery = '(max-width: 1024px)';
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(isMobileOrTabletMediaQuery);
        const updateMatch = () => setMatches(media.matches);

        updateMatch();

        media.addEventListener('change', updateMatch);

        return () => media.removeEventListener('change', updateMatch);
    }, []);

    return matches;
};
