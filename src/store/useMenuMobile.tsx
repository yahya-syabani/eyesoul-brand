import { useEffect, useCallback } from 'react';
import { useToggle } from '@/hooks/useToggle';

const useMenuMobile = () => {
    const [openMenuMobile, toggleMenuMobile, openMenuMobileFn, closeMenuMobile] = useToggle(false)

    const handleMenuMobile = toggleMenuMobile

    const handleClickOutsideMenuMobile = useCallback((event: Event) => {
        const targetElement = event.target as Element;

        if (openMenuMobile && !targetElement.closest('#menu-mobile')) {
            closeMenuMobile()
        }
    }, [openMenuMobile, closeMenuMobile]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutsideMenuMobile);

        return () => {
            document.removeEventListener('click', handleClickOutsideMenuMobile);
        };
    }, [handleClickOutsideMenuMobile])

    return {
        openMenuMobile,
        handleMenuMobile,
    }
}

export default useMenuMobile
