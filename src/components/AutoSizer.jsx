import React, { useState, useEffect, useRef } from 'react';

// AutoSizer component for dynamic container sizing
const AutoSizer = ({ children, onResize }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        onResize({ width, height });
      }
    };

    updateDimensions();

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    } else {
      // Fallback to window resize listener
      window.addEventListener('resize', updateDimensions);
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [onResize]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {children(dimensions)}
    </div>
  );
};

export default AutoSizer;