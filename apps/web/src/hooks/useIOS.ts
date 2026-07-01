import { useState, useEffect } from 'react';

export function useIOS() {
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasNotch, setHasNotch] = useState(false);
  const [iosVersion, setIosVersion] = useState(0);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isTouchDevice = navigator.maxTouchPoints > 0;
    const iosUA = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const ipadOS13 = ua.includes('Macintosh') && isTouchDevice;
    const ios = iosUA || ipadOS13;
    const safari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const standalone = window.matchMedia('(display-mode: standalone)').matches;

    const notch = standalone ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (ios && (window.screen.height >= 812 || window.screen.width >= 812));

    const versionMatch = ua.match(/OS (\d+)_/);
    const version = versionMatch ? parseInt(versionMatch[1]) : 0;

    setIsIOS(ios);
    setIsSafari(safari);
    setIsStandalone(standalone);
    setHasNotch(notch);
    setIosVersion(version);
  }, []);

  return { isIOS, isSafari, isStandalone, hasNotch, iosVersion };
}

export function useKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        setIsKeyboardOpen(true);
      }
    };
    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        setTimeout(() => setIsKeyboardOpen(false), 100);
      }
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  return isKeyboardOpen;
}
