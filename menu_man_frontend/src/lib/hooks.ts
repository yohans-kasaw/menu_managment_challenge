import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore, RootState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()


// responsive hooks
import { useState, useEffect } from "react";
export const useResponsive = (maxWidth: number): boolean => {
  const [isMobile, setIsMobile] = useState(() => {
    // Check if window is available (i.e., if it's running in the browser)
    if (typeof window !== 'undefined') {
      return window.innerWidth <= maxWidth;
    }
    return false; // Default value when window is not available (server-side)
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= maxWidth);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [maxWidth]);

  return isMobile;
};
