import { useEffect, useState } from 'react';

const FLASH_INTERVAL_MS = 150;
const FLASH_COUNT = 6;

export const useBlink = (token = 0) => {
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      setFlashOn((current) => !current);
      count += 1;
      if (count >= FLASH_COUNT) {
        clearInterval(interval);
        setFlashOn(false);
      }
    }, FLASH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [token]);

  return flashOn;
};
