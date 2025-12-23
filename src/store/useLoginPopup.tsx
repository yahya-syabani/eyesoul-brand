import { useEffect, useCallback } from 'react';
import { useToggle } from '@/hooks/useToggle';

const useLoginPopup = () => {
    const [openLoginPopup, toggleLoginPopup, , closeLoginPopup] = useToggle(false)

    const handleLoginPopup = toggleLoginPopup

    // Check if the click event occurs outside the popup.
    const handleClickOutsideLoginPopup = useCallback((event: Event) => {
        // Cast event.target to Element to use the closest method.
        const targetElement = event.target as Element;

        if (openLoginPopup && !targetElement.closest('.login-popup')) {
            closeLoginPopup()
        }
    }, [openLoginPopup])

    useEffect(() => {
        // Add a global click event to track clicks outside the popup.
        document.addEventListener('click', handleClickOutsideLoginPopup);

        // Cleanup to avoid memory leaks.
        return () => {
            document.removeEventListener('click', handleClickOutsideLoginPopup);
        };
    }, [handleClickOutsideLoginPopup])

    return {
        openLoginPopup,
        handleLoginPopup,
    }
}

export default useLoginPopup