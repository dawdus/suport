import * as React from 'react';
type Size = {
  w: number;
  h: number;
};

export const useViewportSize = () => {
  const [size, setSize] = React.useState<Size>({ w: 0, h: 0 });
  const handleResize = (e: UIEvent) => {
    setSize({ w: window.innerWidth, h: window.innerHeight });
  };
  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    setSize({ w: window.innerWidth, h: window.innerHeight });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return size;
};
