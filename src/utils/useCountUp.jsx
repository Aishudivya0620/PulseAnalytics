import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export const useCountUp = (endValue, duration = 1.5) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    // If it's a string that contains non-numeric (like 284.5K), we don't animate or we extract number.
    // For simplicity, let's assume endValue is a raw number.
    if (typeof endValue !== 'number') {
      setValue(endValue);
      return;
    }
    
    const controls = animate(0, endValue, {
      duration,
      ease: "easeOut",
      onUpdate(val) {
        setValue(Math.round(val));
      }
    });

    return () => controls.stop();
  }, [endValue, duration]);

  return value;
};
