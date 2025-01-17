import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { useUpdateClicksMutation } from '../../services';
import { LiveClicks } from './LiveClicks';

export const HomePage = () => {
  const [clicks, setClicks] = useState(0);
  const [debouncedClicks] = useDebounce(clicks, 500);

  const [updateClicks] = useUpdateClicksMutation();

  const onClick = async () => {
    setClicks(clicks + 1);
  };

  useEffect(() => {
    if (debouncedClicks > 0) {
      updateClicks({ clicksCount: debouncedClicks }).catch(console.error);
      setClicks(0);
    }
  }, [debouncedClicks]);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <button className="hover:underline" onClick={onClick}>
        Click!
      </button>
      <LiveClicks clicksCount={clicks} />
    </div>
  );
};
